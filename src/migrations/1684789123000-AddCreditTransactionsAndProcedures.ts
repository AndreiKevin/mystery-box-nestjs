import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCreditTransactionsAndProcedures1684789123000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop RegisterUser procedure if it exists
    await queryRunner.query('DROP PROCEDURE IF EXISTS RegisterUser');

    // Create RegisterUser procedure
    await queryRunner.query(`
    CREATE PROCEDURE RegisterUser(
        IN p_username VARCHAR(50),
        IN p_email VARCHAR(100),
        IN p_password_hash VARCHAR(255),
        IN p_referral_code VARCHAR(10)
    )
    BEGIN
        DECLARE new_user_id BIGINT;
        DECLARE referrer_user_id BIGINT;
        
        -- Check if referral code is provided and exists
        IF p_referral_code IS NOT NULL THEN
            SELECT id INTO referrer_user_id
            FROM users
            WHERE referral_code = p_referral_code;
            
            -- If referral code exists, insert new user with the referrer_id
            IF referrer_user_id IS NOT NULL THEN
                INSERT INTO users (username, email, password_hash, referral_code, referrer_id, credits)
                VALUES (p_username, p_email, p_password_hash, LEFT(UUID(), 10), referrer_user_id, 1000);
            ELSE
                -- Referral code does not exist, insert without referrer_id
                INSERT INTO users (username, email, password_hash, referral_code, credits)
                VALUES (p_username, p_email, p_password_hash, LEFT(UUID(), 10), 1000);
            END IF;
        ELSE
            -- No referral code provided, insert user without referrer_id
            INSERT INTO users (username, email, password_hash, referral_code, credits)
            VALUES (p_username, p_email, p_password_hash, LEFT(UUID(), 10), 1000);
        END IF;

        SET new_user_id = LAST_INSERT_ID();

        -- Add initial credit transaction
        INSERT INTO credit_transactions (user_id, amount, transaction_type)
        VALUES (new_user_id, 1000, 'INITIAL');

        -- Return the newly created user's information
        SELECT id, username, email, referral_code, credits
        FROM users
        WHERE id = new_user_id;
    END
    `);

    // Drop PurchaseMysteryBox procedure if it exists
    await queryRunner.query('DROP PROCEDURE IF EXISTS PurchaseMysteryBox');

    // Create PurchaseMysteryBox procedure
    await queryRunner.query(`
      CREATE PROCEDURE PurchaseMysteryBox(IN p_user_id BIGINT, IN p_mystery_box_id BIGINT)
      BEGIN
        DECLARE v_remaining_quantity INT;
        DECLARE v_credits DECIMAL(10,2);
        DECLARE v_treasure_type_id BIGINT;
        DECLARE v_price DECIMAL(10,2);
        DECLARE v_remaining_credits DECIMAL(10,2);

        START TRANSACTION;

        SELECT credits INTO v_credits FROM users WHERE id = p_user_id FOR UPDATE;

        SELECT price INTO v_price FROM mystery_boxes WHERE id = p_mystery_box_id;
        IF v_price IS NULL THEN
          ROLLBACK;
          SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid mystery box';
        END IF;

        IF v_credits < v_price THEN
          ROLLBACK;
          SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Not enough credits';
        END IF;

        SELECT id, remaining_quantity INTO v_treasure_type_id, v_remaining_quantity
        FROM treasure_types
        WHERE remaining_quantity > 0
        ORDER BY RAND()
        LIMIT 1
        FOR UPDATE;

        IF v_treasure_type_id IS NULL THEN
          ROLLBACK;
          SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No available treasure';
        END IF;

        IF v_remaining_quantity <= 0 THEN
          ROLLBACK;
          SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No available treasure';
        END IF;

        UPDATE users
        SET credits = credits - v_price
        WHERE id = p_user_id;

        SELECT credits INTO v_remaining_credits FROM users WHERE id = p_user_id;

        INSERT INTO mystery_purchases (user_id, treasure_type_id, price)
        VALUES (p_user_id, v_treasure_type_id, v_price);

        UPDATE treasure_types
        SET remaining_quantity = remaining_quantity - 1
        WHERE id = v_treasure_type_id;

        INSERT INTO credit_transactions (user_id, amount, transaction_type)
        VALUES (p_user_id, v_price, 'PURCHASE');

        COMMIT;

        -- Return the treasure received and remaining credits
        SELECT t.*, v_remaining_credits AS remaining_credits
        FROM treasure_types t
        WHERE t.id = v_treasure_type_id;
      END
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop procedures
    await queryRunner.query('DROP PROCEDURE IF EXISTS PurchaseMysteryBox');
    await queryRunner.query('DROP PROCEDURE IF EXISTS RegisterUser');
  }
}
