CREATE TABLE
    `guild` (
        `ID` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
        `NOME` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
        `WELCOME_ID` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
        `LOG_ID` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
        `ROLEDEFAULT_ID` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
        `ROLEBOTDEFAULT_ID` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
        `RULES_CH_ID` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
        `BOOST_CH_ID` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
        'ANNOUNCEMENT_CH_ID' varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
        PRIMARY KEY (`ID`)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

CREATE TABLE
    `guild_member` (
        `GUILD_ID` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
        `MEMBER_ID` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
        PRIMARY KEY (`GUILD_ID`, `MEMBER_ID`),
        KEY `MEMBER_ID` (`MEMBER_ID`),
        CONSTRAINT `guild_member_ibfk_1` FOREIGN KEY (`GUILD_ID`) REFERENCES `guild` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT `guild_member_ibfk_2` FOREIGN KEY (`MEMBER_ID`) REFERENCES `member` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

CREATE TABLE
    `holyday` (
        `GUILD_ID` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
        `CATEGORY_CH` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
        `NAME_CHANNEL` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
        `HOLYDAY_CHANNEL` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
        PRIMARY KEY (`GUILD_ID`),
        CONSTRAINT `holyday_ibfk_1` FOREIGN KEY (`GUILD_ID`) REFERENCES `guild` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

CREATE TABLE
    `logs` (
        `ID` bigint unsigned NOT NULL AUTO_INCREMENT,
        `GUILD_ID` varchar(25) COLLATE utf8mb4_general_ci NOT NULL,
        `LOG_TYPE` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
        `ACTOR_ID` varchar(25) COLLATE utf8mb4_general_ci DEFAULT NULL,
        `TARGET_ID` varchar(25) COLLATE utf8mb4_general_ci DEFAULT NULL,
        `TARGET_TYPE` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
        `DETAILS` longtext CHARACTER
        SET
            utf8mb4 COLLATE utf8mb4_bin,
            `CREATED_AT` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (`ID`),
            KEY `idx_guild_type` (`GUILD_ID`, `LOG_TYPE`),
            KEY `idx_actor_id` (`ACTOR_ID`),
            KEY `idx_target_id` (`TARGET_ID`),
            CONSTRAINT `logs_ibfk_1` FOREIGN KEY (`GUILD_ID`) REFERENCES `guild` (`ID`) ON DELETE CASCADE,
            CONSTRAINT `logs_chk_1` CHECK (json_valid (`DETAILS`))
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

CREATE TABLE
    `member` (
        `ID` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
        `NOME` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
        PRIMARY KEY (`ID`)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

CREATE TABLE
    `member_role` (
        `MEMBER_ID` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
        `ROLE_ID` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
        PRIMARY KEY (`MEMBER_ID`, `ROLE_ID`),
        KEY `ROLE_ID` (`ROLE_ID`),
        CONSTRAINT `member_role_ibfk_1` FOREIGN KEY (`MEMBER_ID`) REFERENCES `member` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT `member_role_ibfk_2` FOREIGN KEY (`ROLE_ID`) REFERENCES `role` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

CREATE TABLE
    `role` (
        `ID` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
        `NOME` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
        `COLORE` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
        `IDGUILD` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
        PRIMARY KEY (`ID`),
        KEY `IDGUILD` (`IDGUILD`),
        CONSTRAINT `role_ibfk_1` FOREIGN KEY (`IDGUILD`) REFERENCES `guild` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

DROP TABLE IF EXISTS `temp_channel`;

CREATE TABLE
    `temp_channel` (
        `GUILD_ID` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
        `CATEGORY_CH` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
        `DUO_CH` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
        `TRIO_CH` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
        `QUARTET_CH` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
        `NOLIMIT_CH` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
        PRIMARY KEY (`GUILD_ID`),
        CONSTRAINT `temp_channel_ibfk_1` FOREIGN KEY (`GUILD_ID`) REFERENCES `guild` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;