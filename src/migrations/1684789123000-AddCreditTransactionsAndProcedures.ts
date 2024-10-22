import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCreditTransactionsAndProcedures1684789123000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create credit_transactions table
    await queryRunner.query(`
      CREATE TABLE credit_transactions (
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        user_id BIGINT NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        transaction_type ENUM('PURCHASE', 'REFUND', 'BONUS', 'INITIAL') NOT NULL,
        reference_id BIGINT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
    `);

    // Create RegisterUser procedure
    await queryRunner.query(`
      CREATE PROCEDURE RegisterUser(
        IN p_username VARCHAR(50),
        IN p_email VARCHAR(100),
        IN p_password_hash VARCHAR(255),
        IN p_referral_code VARCHAR(10)
      )
      BEGIN
        DECLARE referrer_user_id BIGINT;
        
        IF p_referral_code IS NOT NULL THEN
          SELECT id INTO referrer_user_id
          FROM users
          WHERE p_referral_code = p_referral_code;
          
          IF referrer_user_id IS NOT NULL THEN
            INSERT INTO users (username, email, password_hash, referral_code, referrer_id, credits)
            VALUES (p_username, p_email, p_password_hash, LEFT(UUID(), 10), referrer_user_id, 1000);
          ELSE
            INSERT INTO users (username, email, password_hash, referral_code, credits)
            VALUES (p_username, p_email, p_password_hash, LEFT(UUID(), 10), 1000);
          END IF;
        ELSE
          INSERT INTO users (username, email, password_hash, referral_code, credits)
          VALUES (p_username, p_email, p_password_hash, LEFT(UUID(), 10), 1000);
        END IF;

        INSERT INTO credit_transactions (user_id, amount, transaction_type)
        VALUES (LAST_INSERT_ID(), 1000, 'INITIAL');
      END
    `);

    // Create PurchaseMysteryBox procedure
    await queryRunner.query(`
      CREATE PROCEDURE PurchaseMysteryBox(IN p_user_id BIGINT)
      BEGIN
        DECLARE v_remaining_quantity INT;
        DECLARE v_credits DECIMAL(10,2);
        DECLARE v_treasure_type_id BIGINT;
        DECLARE v_amount DECIMAL(10,2);

        START TRANSACTION;

        SELECT credits INTO v_credits FROM users WHERE id = p_user_id FOR UPDATE;
        IF v_credits < 100 THEN
          ROLLBACK;
          SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Not enough credits';
        END IF;

        SELECT id, amount, remaining_quantity INTO v_treasure_type_id, v_amount, v_remaining_quantity
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
        SET credits = credits - v_amount
        WHERE id = p_user_id;

        INSERT INTO mystery_purchases (user_id, treasure_type_id, price)
        VALUES (p_user_id, v_treasure_type_id, v_amount);

        UPDATE treasure_types
        SET remaining_quantity = remaining_quantity - 1
        WHERE id = v_treasure_type_id;

        INSERT INTO credit_transactions (user_id, amount, transaction_type)
        VALUES (p_user_id, v_amount, 'PURCHASE');

        COMMIT;
      END
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop procedures
    await queryRunner.query(`DROP PROCEDURE IF EXISTS PurchaseMysteryBox`);
    await queryRunner.query(`DROP PROCEDURE IF EXISTS RegisterUser`);

    // Drop credit_transactions table
    await queryRunner.query(`DROP TABLE IF EXISTS credit_transactions`);
  }
}
