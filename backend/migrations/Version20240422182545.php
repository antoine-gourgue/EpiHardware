<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240422182545 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE "user" ADD cart_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE "user" ADD CONSTRAINT FK_8D93D6491AD5CDBF FOREIGN KEY (cart_id) REFERENCES carts (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_8D93D6491AD5CDBF ON "user" (cart_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE "user" DROP CONSTRAINT FK_8D93D6491AD5CDBF');
        $this->addSql('DROP INDEX UNIQ_8D93D6491AD5CDBF');
        $this->addSql('ALTER TABLE "user" DROP cart_id');
    }
}
