-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 29, 2023 at 08:41 AM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `hyippro`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int(11) UNSIGNED NOT NULL,
  `name` varchar(191) NOT NULL,
  `username` varchar(50) DEFAULT NULL,
  `email` varchar(191) NOT NULL,
  `password` varchar(191) NOT NULL,
  `image` varchar(191) DEFAULT NULL,
  `phone` varchar(191) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `admin_access` longtext DEFAULT NULL,
  `last_login` varchar(50) DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `name`, `username`, `email`, `password`, `image`, `phone`, `address`, `admin_access`, `last_login`, `status`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'admin', 'admin@gmail.com', '$2y$10$.sO9kLAurqjCYnUatIQeDuwxOqPC7KWPKEIOy5rYf8sGMm0zkLdZm', '62e7e5ae2dfe11659364782.png', '+5641 455646', 'TX, USA', '[\"admin.dashboard\",\"admin.staff\",\"admin.storeStaff\",\"admin.updateStaff\",\"admin.identify-form\",\"admin.identify-form.store\",\"admin.identify-form.store\",\"admin.scheduleManage\",\"admin.planList\",\"admin.store.schedule\",\"admin.update.schedule\",\"admin.planCreate\",\"admin.planEdit\",\"admin.plans-active\",\"admin.plans-inactive\",\"admin.referral-commission\",\"admin.referral-commission.store\",\"admin.transaction\",\"admin.transaction.search\",\"admin.investments\",\"admin.investments.search\",\"admin.commissions\",\"admin.commissions.search\",\"admin.users\",\"admin.users.search\",\"admin.email-send\",\"admin.user.transaction\",\"admin.user.fundLog\",\"admin.user.withdrawal\",\"admin.user.commissionLog\",\"admin.user.referralMember\",\"admin.user.plan-purchaseLog\",\"admin.user.userKycHistory\",\"admin.kyc.users.pending\",\"admin.kyc.users\",\"admin.user-edit\",\"admin.user-multiple-active\",\"admin.user-multiple-inactive\",\"admin.send-email\",\"admin.user.userKycHistory\",\"admin.user-balance-update\",\"admin.payment.methods\",\"admin.deposit.manual.index\",\"admin.deposit.manual.create\",\"admin.edit.payment.methods\",\"admin.deposit.manual.edit\",\"admin.payment.pending\",\"admin.payment.log\",\"admin.payment.search\",\"admin.payment.action\",\"admin.payout-method\",\"admin.payout-log\",\"admin.payout-request\",\"admin.payout-log.search\",\"admin.payout-method.create\",\"admin.payout-method.edit\",\"admin.payout-action\",\"admin.ticket\",\"admin.ticket.view\",\"admin.ticket.reply\",\"admin.ticket.delete\",\"admin.subscriber.index\",\"admin.subscriber.sendEmail\",\"admin.subscriber.remove\",\"admin.basic-controls\",\"admin.email-controls\",\"admin.email-template.show\",\"admin.sms.config\",\"admin.sms-template\",\"admin.notify-config\",\"admin.notify-template.show\",\"admin.notify-template.edit\",\"admin.basic-controls.update\",\"admin.email-controls.update\",\"admin.email-template.edit\",\"admin.sms-template.edit\",\"admin.notify-config.update\",\"admin.notify-template.update\",\"admin.language.index\",\"admin.language.create\",\"admin.language.edit\",\"admin.language.keywordEdit\",\"admin.language.delete\",\"admin.manage.theme\",\"admin.logo-seo\",\"admin.breadcrumb\",\"admin.template.show\",\"admin.content.index\",\"admin.content.create\",\"admin.logoUpdate\",\"admin.seoUpdate\",\"admin.breadcrumbUpdate\",\"admin.content.show\",\"admin.content.delete\"]', '2023-01-06 11:57:52', 1, 'HAAihwNaLWZ8lb9rIg68tZxlSe7F0RsgxJgVReIZPQTMP3dcGkpzTHU881FD', '2021-12-17 10:00:01', '2023-01-06 05:57:52');

-- --------------------------------------------------------

--
-- Table structure for table `configures`
--

CREATE TABLE `configures` (
  `id` int(11) UNSIGNED NOT NULL,
  `site_title` varchar(20) DEFAULT NULL,
  `base_color` varchar(10) NOT NULL DEFAULT '',
  `base_light_color` varchar(20) DEFAULT NULL,
  `secondary_color` varchar(20) DEFAULT NULL,
  `heading_color` varchar(20) DEFAULT NULL,
  `time_zone` varchar(30) DEFAULT NULL,
  `currency` varchar(20) DEFAULT NULL,
  `currency_symbol` varchar(20) DEFAULT NULL,
  `theme` varchar(60) DEFAULT NULL,
  `fraction_number` int(11) DEFAULT NULL,
  `paginate` int(11) DEFAULT NULL,
  `email_verification` tinyint(1) NOT NULL DEFAULT 0,
  `email_notification` tinyint(1) NOT NULL DEFAULT 0,
  `sms_verification` tinyint(1) NOT NULL DEFAULT 0,
  `sms_notification` tinyint(1) NOT NULL DEFAULT 0,
  `investment_commission` tinyint(1) NOT NULL DEFAULT 0,
  `deposit_commission` tinyint(1) NOT NULL DEFAULT 0,
  `sender_email` varchar(60) DEFAULT NULL,
  `sender_email_name` varchar(91) DEFAULT NULL,
  `email_description` longtext DEFAULT NULL,
  `email_configuration` text DEFAULT NULL,
  `push_notification` tinyint(1) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `min_transfer` decimal(11,2) NOT NULL DEFAULT 0.00,
  `max_transfer` decimal(11,2) NOT NULL DEFAULT 0.00,
  `transfer_charge` int(11) NOT NULL DEFAULT 0,
  `bonus_amount` int(11) NOT NULL DEFAULT 20,
  `joining_bonus` tinyint(1) NOT NULL,
  `error_log` tinyint(1) NOT NULL,
  `strong_password` tinyint(1) NOT NULL,
  `registration` tinyint(1) NOT NULL,
  `address_verification` tinyint(1) NOT NULL,
  `identity_verification` tinyint(1) NOT NULL,
  `maintenance` tinyint(1) NOT NULL,
  `is_active_cron_notification` tinyint(1) NOT NULL DEFAULT 0,
  `tawk_id` varchar(255) DEFAULT NULL,
  `tawk_status` tinyint(1) NOT NULL DEFAULT 0,
  `fb_messenger_status` tinyint(1) NOT NULL DEFAULT 0,
  `fb_app_id` varchar(255) DEFAULT NULL,
  `fb_page_id` varchar(255) DEFAULT NULL,
  `reCaptcha_status_login` tinyint(1) NOT NULL DEFAULT 0,
  `reCaptcha_status_registration` tinyint(1) NOT NULL DEFAULT 0,
  `MEASUREMENT_ID` varchar(255) DEFAULT NULL,
  `analytic_status` tinyint(1) NOT NULL,
  `profit_commission` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `configures`
--

INSERT INTO `configures` (`id`, `site_title`, `base_color`, `base_light_color`, `secondary_color`, `heading_color`, `time_zone`, `currency`, `currency_symbol`, `theme`, `fraction_number`, `paginate`, `email_verification`, `email_notification`, `sms_verification`, `sms_notification`, `investment_commission`, `deposit_commission`, `sender_email`, `sender_email_name`, `email_description`, `email_configuration`, `push_notification`, `created_at`, `updated_at`, `min_transfer`, `max_transfer`, `transfer_charge`, `bonus_amount`, `joining_bonus`, `error_log`, `strong_password`, `registration`, `address_verification`, `identity_verification`, `maintenance`, `is_active_cron_notification`, `tawk_id`, `tawk_status`, `fb_messenger_status`, `fb_app_id`, `fb_page_id`, `reCaptcha_status_login`, `reCaptcha_status_registration`, `MEASUREMENT_ID`, `analytic_status`, `profit_commission`) VALUES
(1, 'Hyippro', '#ff5400', NULL, NULL, NULL, 'UTC', 'USD', '$', 'deepblack', 0, 20, 0, 0, 0, 0, 0, 0, 'support@mail.com', 'Bug Finder', '<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\">\r\n<meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\r\n<meta name=\"viewport\" content=\"width=device-width\">\r\n<style type=\"text/css\">\r\n    @media only screen and (min-width: 620px) {\r\n        * [lang=x-wrapper] h1 {\r\n        }\r\n\r\n        * [lang=x-wrapper] h1 {\r\n            font-size: 26px !important;\r\n            line-height: 34px !important\r\n        }\r\n\r\n        * [lang=x-wrapper] h2 {\r\n        }\r\n\r\n        * [lang=x-wrapper] h2 {\r\n            font-size: 20px !important;\r\n            line-height: 28px !important\r\n        }\r\n\r\n        * [lang=x-wrapper] h3 {\r\n        }\r\n\r\n        * [lang=x-layout__inner] p,\r\n        * [lang=x-layout__inner] ol,\r\n        * [lang=x-layout__inner] ul {\r\n        }\r\n\r\n        * div [lang=x-size-8] {\r\n            font-size: 8px !important;\r\n            line-height: 14px !important\r\n        }\r\n\r\n        * div [lang=x-size-9] {\r\n            font-size: 9px !important;\r\n            line-height: 16px !important\r\n        }\r\n\r\n        * div [lang=x-size-10] {\r\n            font-size: 10px !important;\r\n            line-height: 18px !important\r\n        }\r\n\r\n        * div [lang=x-size-11] {\r\n            font-size: 11px !important;\r\n            line-height: 19px !important\r\n        }\r\n\r\n        * div [lang=x-size-12] {\r\n            font-size: 12px !important;\r\n            line-height: 19px !important\r\n        }\r\n\r\n        * div [lang=x-size-13] {\r\n            font-size: 13px !important;\r\n            line-height: 21px !important\r\n        }\r\n\r\n        * div [lang=x-size-14] {\r\n            font-size: 14px !important;\r\n            line-height: 21px !important\r\n        }\r\n\r\n        * div [lang=x-size-15] {\r\n            font-size: 15px !important;\r\n            line-height: 23px !important\r\n        }\r\n\r\n        * div [lang=x-size-16] {\r\n            font-size: 16px !important;\r\n            line-height: 24px !important\r\n        }\r\n\r\n        * div [lang=x-size-17] {\r\n            font-size: 17px !important;\r\n            line-height: 26px !important\r\n        }\r\n\r\n        * div [lang=x-size-18] {\r\n            font-size: 18px !important;\r\n            line-height: 26px !important\r\n        }\r\n\r\n        * div [lang=x-size-18] {\r\n            font-size: 18px !important;\r\n            line-height: 26px !important\r\n        }\r\n\r\n        * div [lang=x-size-20] {\r\n            font-size: 20px !important;\r\n            line-height: 28px !important\r\n        }\r\n\r\n        * div [lang=x-size-22] {\r\n            font-size: 22px !important;\r\n            line-height: 31px !important\r\n        }\r\n\r\n        * div [lang=x-size-24] {\r\n            font-size: 24px !important;\r\n            line-height: 32px !important\r\n        }\r\n\r\n        * div [lang=x-size-26] {\r\n            font-size: 26px !important;\r\n            line-height: 34px !important\r\n        }\r\n\r\n        * div [lang=x-size-28] {\r\n            font-size: 28px !important;\r\n            line-height: 36px !important\r\n        }\r\n\r\n        * div [lang=x-size-30] {\r\n            font-size: 30px !important;\r\n            line-height: 38px !important\r\n        }\r\n\r\n        * div [lang=x-size-32] {\r\n            font-size: 32px !important;\r\n            line-height: 40px !important\r\n        }\r\n\r\n        * div [lang=x-size-34] {\r\n            font-size: 34px !important;\r\n            line-height: 43px !important\r\n        }\r\n\r\n        * div [lang=x-size-36] {\r\n            font-size: 36px !important;\r\n            line-height: 43px !important\r\n        }\r\n\r\n        * div [lang=x-size-40] {\r\n            font-size: 40px !important;\r\n            line-height: 47px !important\r\n        }\r\n\r\n        * div [lang=x-size-44] {\r\n            font-size: 44px !important;\r\n            line-height: 50px !important\r\n        }\r\n\r\n        * div [lang=x-size-48] {\r\n            font-size: 48px !important;\r\n            line-height: 54px !important\r\n        }\r\n\r\n        * div [lang=x-size-56] {\r\n            font-size: 56px !important;\r\n            line-height: 60px !important\r\n        }\r\n\r\n        * div [lang=x-size-64] {\r\n            font-size: 64px !important;\r\n            line-height: 63px !important\r\n        }\r\n    }\r\n</style>\r\n<style type=\"text/css\">\r\n    body {\r\n        margin: 0;\r\n        padding: 0;\r\n    }\r\n\r\n    table {\r\n        border-collapse: collapse;\r\n        table-layout: fixed;\r\n    }\r\n\r\n    * {\r\n        line-height: inherit;\r\n    }\r\n\r\n    [x-apple-data-detectors],\r\n    [href^=\"tel\"],\r\n    [href^=\"sms\"] {\r\n        color: inherit !important;\r\n        text-decoration: none !important;\r\n    }\r\n\r\n    .wrapper .footer__share-button a:hover,\r\n    .wrapper .footer__share-button a:focus {\r\n        color: #ffffff !important;\r\n    }\r\n\r\n    .btn a:hover,\r\n    .btn a:focus,\r\n    .footer__share-button a:hover,\r\n    .footer__share-button a:focus,\r\n    .email-footer__links a:hover,\r\n    .email-footer__links a:focus {\r\n        opacity: 0.8;\r\n    }\r\n\r\n    .preheader,\r\n    .header,\r\n    .layout,\r\n    .column {\r\n        transition: width 0.25s ease-in-out, max-width 0.25s ease-in-out;\r\n    }\r\n\r\n    .layout,\r\n    .header {\r\n        max-width: 400px !important;\r\n        -fallback-width: 95% !important;\r\n        width: calc(100% - 20px) !important;\r\n    }\r\n\r\n    div.preheader {\r\n        max-width: 360px !important;\r\n        -fallback-width: 90% !important;\r\n        width: calc(100% - 60px) !important;\r\n    }\r\n\r\n    .snippet,\r\n    .webversion {\r\n        Float: none !important;\r\n    }\r\n\r\n    .column {\r\n        max-width: 400px !important;\r\n        width: 100% !important;\r\n    }\r\n\r\n    .fixed-width.has-border {\r\n        max-width: 402px !important;\r\n    }\r\n\r\n    .fixed-width.has-border .layout__inner {\r\n        box-sizing: border-box;\r\n    }\r\n\r\n    .snippet,\r\n    .webversion {\r\n        width: 50% !important;\r\n    }\r\n\r\n    .ie .btn {\r\n        width: 100%;\r\n    }\r\n\r\n    .ie .column,\r\n    [owa] .column,\r\n    .ie .gutter,\r\n    [owa] .gutter {\r\n        display: table-cell;\r\n        float: none !important;\r\n        vertical-align: top;\r\n    }\r\n\r\n    .ie div.preheader,\r\n    [owa] div.preheader,\r\n    .ie .email-footer,\r\n    [owa] .email-footer {\r\n        max-width: 560px !important;\r\n        width: 560px !important;\r\n    }\r\n\r\n    .ie .snippet,\r\n    [owa] .snippet,\r\n    .ie .webversion,\r\n    [owa] .webversion {\r\n        width: 280px !important;\r\n    }\r\n\r\n    .ie .header,\r\n    [owa] .header,\r\n    .ie .layout,\r\n    [owa] .layout,\r\n    .ie .one-col .column,\r\n    [owa] .one-col .column {\r\n        max-width: 600px !important;\r\n        width: 600px !important;\r\n    }\r\n\r\n    .ie .fixed-width.has-border,\r\n    [owa] .fixed-width.has-border,\r\n    .ie .has-gutter.has-border,\r\n    [owa] .has-gutter.has-border {\r\n        max-width: 602px !important;\r\n        width: 602px !important;\r\n    }\r\n\r\n    .ie .two-col .column,\r\n    [owa] .two-col .column {\r\n        width: 300px !important;\r\n    }\r\n\r\n    .ie .three-col .column,\r\n    [owa] .three-col .column,\r\n    .ie .narrow,\r\n    [owa] .narrow {\r\n        width: 200px !important;\r\n    }\r\n\r\n    .ie .wide,\r\n    [owa] .wide {\r\n        width: 400px !important;\r\n    }\r\n\r\n    .ie .two-col.has-gutter .column,\r\n    [owa] .two-col.x_has-gutter .column {\r\n        width: 290px !important;\r\n    }\r\n\r\n    .ie .three-col.has-gutter .column,\r\n    [owa] .three-col.x_has-gutter .column,\r\n    .ie .has-gutter .narrow,\r\n    [owa] .has-gutter .narrow {\r\n        width: 188px !important;\r\n    }\r\n\r\n    .ie .has-gutter .wide,\r\n    [owa] .has-gutter .wide {\r\n        width: 394px !important;\r\n    }\r\n\r\n    .ie .two-col.has-gutter.has-border .column,\r\n    [owa] .two-col.x_has-gutter.x_has-border .column {\r\n        width: 292px !important;\r\n    }\r\n\r\n    .ie .three-col.has-gutter.has-border .column,\r\n    [owa] .three-col.x_has-gutter.x_has-border .column,\r\n    .ie .has-gutter.has-border .narrow,\r\n    [owa] .has-gutter.x_has-border .narrow {\r\n        width: 190px !important;\r\n    }\r\n\r\n    .ie .has-gutter.has-border .wide,\r\n    [owa] .has-gutter.x_has-border .wide {\r\n        width: 396px !important;\r\n    }\r\n\r\n    .ie .fixed-width .layout__inner {\r\n        border-left: 0 none white !important;\r\n        border-right: 0 none white !important;\r\n    }\r\n\r\n    .ie .layout__edges {\r\n        display: none;\r\n    }\r\n\r\n    .mso .layout__edges {\r\n        font-size: 0;\r\n    }\r\n\r\n    .layout-fixed-width,\r\n    .mso .layout-full-width {\r\n        background-color: #ffffff;\r\n    }\r\n\r\n    @media only screen and (min-width: 620px) {\r\n\r\n        .column,\r\n        .gutter {\r\n            display: table-cell;\r\n            Float: none !important;\r\n            vertical-align: top;\r\n        }\r\n\r\n        div.preheader,\r\n        .email-footer {\r\n            max-width: 560px !important;\r\n            width: 560px !important;\r\n        }\r\n\r\n        .snippet,\r\n        .webversion {\r\n            width: 280px !important;\r\n        }\r\n\r\n        .header,\r\n        .layout,\r\n        .one-col .column {\r\n            max-width: 600px !important;\r\n            width: 600px !important;\r\n        }\r\n\r\n        .fixed-width.has-border,\r\n        .fixed-width.ecxhas-border,\r\n        .has-gutter.has-border,\r\n        .has-gutter.ecxhas-border {\r\n            max-width: 602px !important;\r\n            width: 602px !important;\r\n        }\r\n\r\n        .two-col .column {\r\n            width: 300px !important;\r\n        }\r\n\r\n        .three-col .column,\r\n        .column.narrow {\r\n            width: 200px !important;\r\n        }\r\n\r\n        .column.wide {\r\n            width: 400px !important;\r\n        }\r\n\r\n        .two-col.has-gutter .column,\r\n        .two-col.ecxhas-gutter .column {\r\n            width: 290px !important;\r\n        }\r\n\r\n        .three-col.has-gutter .column,\r\n        .three-col.ecxhas-gutter .column,\r\n        .has-gutter .narrow {\r\n            width: 188px !important;\r\n        }\r\n\r\n        .has-gutter .wide {\r\n            width: 394px !important;\r\n        }\r\n\r\n        .two-col.has-gutter.has-border .column,\r\n        .two-col.ecxhas-gutter.ecxhas-border .column {\r\n            width: 292px !important;\r\n        }\r\n\r\n        .three-col.has-gutter.has-border .column,\r\n        .three-col.ecxhas-gutter.ecxhas-border .column,\r\n        .has-gutter.has-border .narrow,\r\n        .has-gutter.ecxhas-border .narrow {\r\n            width: 190px !important;\r\n        }\r\n\r\n        .has-gutter.has-border .wide,\r\n        .has-gutter.ecxhas-border .wide {\r\n            width: 396px !important;\r\n        }\r\n    }\r\n\r\n    @media only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (min--moz-device-pixel-ratio: 2), only screen and (-o-min-device-pixel-ratio: 2/1), only screen and (min-device-pixel-ratio: 2), only screen and (min-resolution: 192dpi), only screen and (min-resolution: 2dppx) {\r\n        .fblike {\r\n            background-image: url(https://i3.createsend1.com/static/eb/customise/13-the-blueprint-3/images/fblike@2x.png) !important;\r\n        }\r\n\r\n        .tweet {\r\n            background-image: url(https://i4.createsend1.com/static/eb/customise/13-the-blueprint-3/images/tweet@2x.png) !important;\r\n        }\r\n\r\n        .linkedinshare {\r\n            background-image: url(https://i6.createsend1.com/static/eb/customise/13-the-blueprint-3/images/lishare@2x.png) !important;\r\n        }\r\n\r\n        .forwardtoafriend {\r\n            background-image: url(https://i5.createsend1.com/static/eb/customise/13-the-blueprint-3/images/forward@2x.png) !important;\r\n        }\r\n    }\r\n\r\n    @media (max-width: 321px) {\r\n        .fixed-width.has-border .layout__inner {\r\n            border-width: 1px 0 !important;\r\n        }\r\n\r\n        .layout,\r\n        .column {\r\n            min-width: 320px !important;\r\n            width: 320px !important;\r\n        }\r\n\r\n        .border {\r\n            display: none;\r\n        }\r\n    }\r\n\r\n    .mso div {\r\n        border: 0 none white !important;\r\n    }\r\n\r\n    .mso .w560 .divider {\r\n        margin-left: 260px !important;\r\n        margin-right: 260px !important;\r\n    }\r\n\r\n    .mso .w360 .divider {\r\n        margin-left: 160px !important;\r\n        margin-right: 160px !important;\r\n    }\r\n\r\n    .mso .w260 .divider {\r\n        margin-left: 110px !important;\r\n        margin-right: 110px !important;\r\n    }\r\n\r\n    .mso .w160 .divider {\r\n        margin-left: 60px !important;\r\n        margin-right: 60px !important;\r\n    }\r\n\r\n    .mso .w354 .divider {\r\n        margin-left: 157px !important;\r\n        margin-right: 157px !important;\r\n    }\r\n\r\n    .mso .w250 .divider {\r\n        margin-left: 105px !important;\r\n        margin-right: 105px !important;\r\n    }\r\n\r\n    .mso .w148 .divider {\r\n        margin-left: 54px !important;\r\n        margin-right: 54px !important;\r\n    }\r\n\r\n    .mso .font-avenir,\r\n    .mso .font-cabin,\r\n    .mso .font-open-sans,\r\n    .mso .font-ubuntu {\r\n        font-family: sans-serif !important;\r\n    }\r\n\r\n    .mso .font-bitter,\r\n    .mso .font-merriweather,\r\n    .mso .font-pt-serif {\r\n        font-family: Georgia, serif !important;\r\n    }\r\n\r\n    .mso .font-lato,\r\n    .mso .font-roboto {\r\n        font-family: Tahoma, sans-serif !important;\r\n    }\r\n\r\n    .mso .font-pt-sans {\r\n        font-family: \"Trebuchet MS\", sans-serif !important;\r\n    }\r\n\r\n    .mso .footer__share-button p {\r\n        margin: 0;\r\n    }\r\n\r\n    @media only screen and (min-width: 620px) {\r\n        .wrapper .size-8 {\r\n            font-size: 8px !important;\r\n            line-height: 14px !important;\r\n        }\r\n\r\n        .wrapper .size-9 {\r\n            font-size: 9px !important;\r\n            line-height: 16px !important;\r\n        }\r\n\r\n        .wrapper .size-10 {\r\n            font-size: 10px !important;\r\n            line-height: 18px !important;\r\n        }\r\n\r\n        .wrapper .size-11 {\r\n            font-size: 11px !important;\r\n            line-height: 19px !important;\r\n        }\r\n\r\n        .wrapper .size-12 {\r\n            font-size: 12px !important;\r\n            line-height: 19px !important;\r\n        }\r\n\r\n        .wrapper .size-13 {\r\n            font-size: 13px !important;\r\n            line-height: 21px !important;\r\n        }\r\n\r\n        .wrapper .size-14 {\r\n            font-size: 14px !important;\r\n            line-height: 21px !important;\r\n        }\r\n\r\n        .wrapper .size-15 {\r\n            font-size: 15px !important;\r\n            line-height: 23px !important;\r\n        }\r\n\r\n        .wrapper .size-16 {\r\n            font-size: 16px !important;\r\n            line-height: 24px !important;\r\n        }\r\n\r\n        .wrapper .size-17 {\r\n            font-size: 17px !important;\r\n            line-height: 26px !important;\r\n        }\r\n\r\n        .wrapper .size-18 {\r\n            font-size: 18px !important;\r\n            line-height: 26px !important;\r\n        }\r\n\r\n        .wrapper .size-20 {\r\n            font-size: 20px !important;\r\n            line-height: 28px !important;\r\n        }\r\n\r\n        .wrapper .size-22 {\r\n            font-size: 22px !important;\r\n            line-height: 31px !important;\r\n        }\r\n\r\n        .wrapper .size-24 {\r\n            font-size: 24px !important;\r\n            line-height: 32px !important;\r\n        }\r\n\r\n        .wrapper .size-26 {\r\n            font-size: 26px !important;\r\n            line-height: 34px !important;\r\n        }\r\n\r\n        .wrapper .size-28 {\r\n            font-size: 28px !important;\r\n            line-height: 36px !important;\r\n        }\r\n\r\n        .wrapper .size-30 {\r\n            font-size: 30px !important;\r\n            line-height: 38px !important;\r\n        }\r\n\r\n        .wrapper .size-32 {\r\n            font-size: 32px !important;\r\n            line-height: 40px !important;\r\n        }\r\n\r\n        .wrapper .size-34 {\r\n            font-size: 34px !important;\r\n            line-height: 43px !important;\r\n        }\r\n\r\n        .wrapper .size-36 {\r\n            font-size: 36px !important;\r\n            line-height: 43px !important;\r\n        }\r\n\r\n        .wrapper .size-40 {\r\n            font-size: 40px !important;\r\n            line-height: 47px !important;\r\n        }\r\n\r\n        .wrapper .size-44 {\r\n            font-size: 44px !important;\r\n            line-height: 50px !important;\r\n        }\r\n\r\n        .wrapper .size-48 {\r\n            font-size: 48px !important;\r\n            line-height: 54px !important;\r\n        }\r\n\r\n        .wrapper .size-56 {\r\n            font-size: 56px !important;\r\n            line-height: 60px !important;\r\n        }\r\n\r\n        .wrapper .size-64 {\r\n            font-size: 64px !important;\r\n            line-height: 63px !important;\r\n        }\r\n    }\r\n\r\n    .mso .size-8,\r\n    .ie .size-8 {\r\n        font-size: 8px !important;\r\n        line-height: 14px !important;\r\n    }\r\n\r\n    .mso .size-9,\r\n    .ie .size-9 {\r\n        font-size: 9px !important;\r\n        line-height: 16px !important;\r\n    }\r\n\r\n    .mso .size-10,\r\n    .ie .size-10 {\r\n        font-size: 10px !important;\r\n        line-height: 18px !important;\r\n    }\r\n\r\n    .mso .size-11,\r\n    .ie .size-11 {\r\n        font-size: 11px !important;\r\n        line-height: 19px !important;\r\n    }\r\n\r\n    .mso .size-12,\r\n    .ie .size-12 {\r\n        font-size: 12px !important;\r\n        line-height: 19px !important;\r\n    }\r\n\r\n    .mso .size-13,\r\n    .ie .size-13 {\r\n        font-size: 13px !important;\r\n        line-height: 21px !important;\r\n    }\r\n\r\n    .mso .size-14,\r\n    .ie .size-14 {\r\n        font-size: 14px !important;\r\n        line-height: 21px !important;\r\n    }\r\n\r\n    .mso .size-15,\r\n    .ie .size-15 {\r\n        font-size: 15px !important;\r\n        line-height: 23px !important;\r\n    }\r\n\r\n    .mso .size-16,\r\n    .ie .size-16 {\r\n        font-size: 16px !important;\r\n        line-height: 24px !important;\r\n    }\r\n\r\n    .mso .size-17,\r\n    .ie .size-17 {\r\n        font-size: 17px !important;\r\n        line-height: 26px !important;\r\n    }\r\n\r\n    .mso .size-18,\r\n    .ie .size-18 {\r\n        font-size: 18px !important;\r\n        line-height: 26px !important;\r\n    }\r\n\r\n    .mso .size-20,\r\n    .ie .size-20 {\r\n        font-size: 20px !important;\r\n        line-height: 28px !important;\r\n    }\r\n\r\n    .mso .size-22,\r\n    .ie .size-22 {\r\n        font-size: 22px !important;\r\n        line-height: 31px !important;\r\n    }\r\n\r\n    .mso .size-24,\r\n    .ie .size-24 {\r\n        font-size: 24px !important;\r\n        line-height: 32px !important;\r\n    }\r\n\r\n    .mso .size-26,\r\n    .ie .size-26 {\r\n        font-size: 26px !important;\r\n        line-height: 34px !important;\r\n    }\r\n\r\n    .mso .size-28,\r\n    .ie .size-28 {\r\n        font-size: 28px !important;\r\n        line-height: 36px !important;\r\n    }\r\n\r\n    .mso .size-30,\r\n    .ie .size-30 {\r\n        font-size: 30px !important;\r\n        line-height: 38px !important;\r\n    }\r\n\r\n    .mso .size-32,\r\n    .ie .size-32 {\r\n        font-size: 32px !important;\r\n        line-height: 40px !important;\r\n    }\r\n\r\n    .mso .size-34,\r\n    .ie .size-34 {\r\n        font-size: 34px !important;\r\n        line-height: 43px !important;\r\n    }\r\n\r\n    .mso .size-36,\r\n    .ie .size-36 {\r\n        font-size: 36px !important;\r\n        line-height: 43px !important;\r\n    }\r\n\r\n    .mso .size-40,\r\n    .ie .size-40 {\r\n        font-size: 40px !important;\r\n        line-height: 47px !important;\r\n    }\r\n\r\n    .mso .size-44,\r\n    .ie .size-44 {\r\n        font-size: 44px !important;\r\n        line-height: 50px !important;\r\n    }\r\n\r\n    .mso .size-48,\r\n    .ie .size-48 {\r\n        font-size: 48px !important;\r\n        line-height: 54px !important;\r\n    }\r\n\r\n    .mso .size-56,\r\n    .ie .size-56 {\r\n        font-size: 56px !important;\r\n        line-height: 60px !important;\r\n    }\r\n\r\n    .mso .size-64,\r\n    .ie .size-64 {\r\n        font-size: 64px !important;\r\n        line-height: 63px !important;\r\n    }\r\n\r\n    .footer__share-button p {\r\n        margin: 0;\r\n    }\r\n</style>\r\n\r\n<title></title>\r\n<!--[if !mso]><!-->\r\n<style type=\"text/css\">\r\n    @import url(https://fonts.googleapis.com/css?family=Bitter:400,700,400italic|Cabin:400,700,400italic,700italic|Open+Sans:400italic,700italic,700,400);\r\n</style>\r\n<link href=\"https://fonts.googleapis.com/css?family=Bitter:400,700,400italic|Cabin:400,700,400italic,700italic|Open+Sans:400italic,700italic,700,400\" rel=\"stylesheet\" type=\"text/css\">\r\n<!--<![endif]-->\r\n<style type=\"text/css\">\r\n    body {\r\n        background-color: #f5f7fa\r\n    }\r\n\r\n    .mso h1 {\r\n    }\r\n\r\n    .mso h1 {\r\n        font-family: sans-serif !important\r\n    }\r\n\r\n    .mso h2 {\r\n    }\r\n\r\n    .mso h3 {\r\n    }\r\n\r\n    .mso .column,\r\n    .mso .column__background td {\r\n    }\r\n\r\n    .mso .column,\r\n    .mso .column__background td {\r\n        font-family: sans-serif !important\r\n    }\r\n\r\n    .mso .btn a {\r\n    }\r\n\r\n    .mso .btn a {\r\n        font-family: sans-serif !important\r\n    }\r\n\r\n    .mso .webversion,\r\n    .mso .snippet,\r\n    .mso .layout-email-footer td,\r\n    .mso .footer__share-button p {\r\n    }\r\n\r\n    .mso .webversion,\r\n    .mso .snippet,\r\n    .mso .layout-email-footer td,\r\n    .mso .footer__share-button p {\r\n        font-family: sans-serif !important\r\n    }\r\n\r\n    .mso .logo {\r\n    }\r\n\r\n    .mso .logo {\r\n        font-family: Tahoma, sans-serif !important\r\n    }\r\n\r\n    .logo a:hover,\r\n    .logo a:focus {\r\n        color: #859bb1 !important\r\n    }\r\n\r\n    .mso .layout-has-border {\r\n        border-top: 1px solid #b1c1d8;\r\n        border-bottom: 1px solid #b1c1d8\r\n    }\r\n\r\n    .mso .layout-has-bottom-border {\r\n        border-bottom: 1px solid #b1c1d8\r\n    }\r\n\r\n    .mso .border,\r\n    .ie .border {\r\n        background-color: #b1c1d8\r\n    }\r\n\r\n    @media only screen and (min-width: 620px) {\r\n        .wrapper h1 {\r\n        }\r\n\r\n        .wrapper h1 {\r\n            font-size: 26px !important;\r\n            line-height: 34px !important\r\n        }\r\n\r\n        .wrapper h2 {\r\n        }\r\n\r\n        .wrapper h2 {\r\n            font-size: 20px !important;\r\n            line-height: 28px !important\r\n        }\r\n\r\n        .wrapper h3 {\r\n        }\r\n\r\n        .column p,\r\n        .column ol,\r\n        .column ul {\r\n        }\r\n    }\r\n\r\n    .mso h1,\r\n    .ie h1 {\r\n    }\r\n\r\n    .mso h1,\r\n    .ie h1 {\r\n        font-size: 26px !important;\r\n        line-height: 34px !important\r\n    }\r\n\r\n    .mso h2,\r\n    .ie h2 {\r\n    }\r\n\r\n    .mso h2,\r\n    .ie h2 {\r\n        font-size: 20px !important;\r\n        line-height: 28px !important\r\n    }\r\n\r\n    .mso h3,\r\n    .ie h3 {\r\n    }\r\n\r\n    .mso .layout__inner p,\r\n    .ie .layout__inner p,\r\n    .mso .layout__inner ol,\r\n    .ie .layout__inner ol,\r\n    .mso .layout__inner ul,\r\n    .ie .layout__inner ul {\r\n    }\r\n</style>\r\n<meta name=\"robots\" content=\"noindex,nofollow\">\r\n\r\n<meta property=\"og:title\" content=\"Just One More Step\">\r\n\r\n<link href=\"https://css.createsend1.com/css/social.min.css?h=0ED47CE120160920\" media=\"screen,projection\" rel=\"stylesheet\" type=\"text/css\">\r\n\r\n\r\n<div class=\"wrapper\" style=\"min-width: 320px;background-color: #f5f7fa;\" lang=\"x-wrapper\">\r\n    <div class=\"preheader\" style=\"margin: 0 auto;max-width: 560px;min-width: 280px; width: 280px;\">\r\n        <div style=\"border-collapse: collapse;display: table;width: 100%;\">\r\n            <div class=\"snippet\" style=\"display: table-cell;Float: left;font-size: 12px;line-height: 19px;max-width: 280px;min-width: 140px; width: 140px;padding: 10px 0 5px 0;color: #b9b9b9;\">\r\n            </div>\r\n            <div class=\"webversion\" style=\"display: table-cell;Float: left;font-size: 12px;line-height: 19px;max-width: 280px;min-width: 139px; width: 139px;padding: 10px 0 5px 0;text-align: right;color: #b9b9b9;\">\r\n            </div>\r\n        </div>\r\n\r\n        <div class=\"layout one-col fixed-width\" style=\"margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;\">\r\n            <div class=\"layout__inner\" style=\"border-collapse: collapse;display: table;width: 100%;background-color: #c4e5dc;\" lang=\"x-layout__inner\">\r\n                <div class=\"column\" style=\"text-align: left;color: #60666d;font-size: 14px;line-height: 21px;max-width:600px;min-width:320px;\">\r\n                    <div style=\"margin-left: 20px;margin-right: 20px;margin-top: 24px;margin-bottom: 24px;\">\r\n                        <h1 style=\"margin-top: 0;margin-bottom: 0;font-style: normal;font-weight: normal;color: #44a8c7;font-size: 36px;line-height: 43px;font-family: bitter,georgia,serif;text-align: center;\">\r\n                            </h1><h1 style=\"margin-top: 0;margin-bottom: 0;font-style: normal;font-weight: normal;color: #44a8c7;font-size: 36px;line-height: 43px;font-family: bitter,georgia,serif;text-align: center;\"></h1><p style=\"margin-top: 0px; margin-bottom: 0px; font-style: normal; font-weight: normal; color: rgb(68, 168, 199); font-size: 36px; line-height: 43px; font-family: bitter, georgia, serif; text-align: center;\"><img src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOIAAABLCAYAAABtA1vxAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QA/wD/AP+gvaeTAAAAB3RJTUUH5QwRDgowcaAIRgAAAAFvck5UAc+id5oAADDjSURBVHja7Z13fBXF9sC/s7u3p5AEklASeu8giKiAggoWFDsiKioqNn7qs7dneQ97L+gTRUHAgoLYFUFEpBfpnSSQXm9u3zK/P24IhBogEN8z38/nUracOTO7Z9o5Mys4QZjz5rGpXz9azZiBtWI9cvkGIrM+JDZvo8P8cm49q7gsWZaU15eIZEWNuIVpSAlIzSFkUJSIGFuRiPXkKakNCtVrrvEGRbqhjLgA0b0dWrf2WIX5qG06oPTofqKyVEcdNYY4nsLDG5Ygfv0TGibBvJWYn/yAbeo4jzl7UQt25nXEHzyJYKQ9gVATaZgNMAwPpnQgpIqUFRoKkEJHU8JCU73YbPl4HBnYbatlnGepaN10g/3uGzPDA6/TlTNOgjN6QlE59gsvrO2yraOOanNcDDHy+RdYl96E+tQ/sJZuRLx+t4PxX3WUmbkD8frOkf5gVwLhRAxDwZJUGt0hVZJ7zgtAUcCuRfC48oTbuUgkxHxL6/R56oN3bzOuvUOq5/SA4jKsth2wn31ObZdzHXUckho1xMjqZVhPvIjo3wc57RfUy8+MlSs2n2GV+a+h1D+AQCgJw4wanqihpHfLsmmSWHemiHN/KxrET1bHXrjUeGxyhNN7Qm4R4urzsXfoUhtlXEcdh0WpKUH6y2+grN8GXgvqx8XTvMkI89tFM61NOz8hK/8SynxRI4SaM8K9ZemGoKisqczIG2Ot3fG1cf/7k0iIH0Sfzjby87GlxmN+9/WJLNs66qg2x2yIkV9/JABYOwtQL7tUFa2bDZbTfv2Sbbs+oLDsDMK6E0nNGt/BECLaQvrDCTK76HK5btt0+cz7E0T9ep1LE5tirN1GaOzDhNasOf661FHHEXBM1mFM/Aga1sd8cQry9G7NxPpt98ms/BEEQnG1nTEgOqxUBcR5MklLeU307/kf8cdKr+2dF7F++AF18ODa1rCOOoCjbBFDi5egP/0cssyHevYQaN14ML+vnC637ByD/y9ihBCtZiwJJb50NmY8J2fMnUSDhI6hnuchpY7+0Ye1rWEddQBHYYjW6g3w7kRkKIzSvoVTv+7Ou+Sa7R9TUNoD0zrODpGjRAARQ2FXwVC5ZP3n6ildhqqDz0eWBYj8+4Xa1q6OOo7MbKwVC9HHTYLkWETn5vWs2Sv+xc680YR021/SAA9GrLuEpqkP2yeOe9ccN95E07DdN7a2tarjb0y1zSe4aBHq29OQsbEo6Y0aWAuWvSqz84ejm3/NVvBQSMBlD4gWaeNsD13zrDHrNx3Aft//1bZmdfxNqXbXVJn4GcS5EM1TG1i/L31D7sofjvFfaIQQ1TkYccttWY/qT713v7jsDBuKgv7G+NrWrI6/KdUyI/3Jp7FCFjRqECdnL3uLXQUjMM3a1v3YibaMYVo0fszx0WsvmBM/tNBAG3ldbWtWx9+MwxpieNonKPn5qGf2tOlPTHxaZubdi2H+N7aDB0YCHke50ib91siEjya7suag7/ThPKVvbWtWx9+IQxpUaOEChCYxTzoVddSdt8hNWS8T0p21rfRxKYh4zy7Rve1Vcv3Weea3H2PPyERrml7batXxN+GQhqifOwrLpUJaygC5ass0yvwp/5VjwuqSmrSEft0uFWW+TKVhfWx3jKltjer4m3DQyZrwjC+Qp3VC6dcjRW7Z+TTe/3EjBCgo6SVWbHzQfvdVNpEYT2T+77WtUR1/Ew5oWvrq5VjeMmx9Bwh95G1Pys27HqkM2P6rICuWT2lq9P+GGY01PZaYVgl4nAHRpdV1rFj/mbFgJp7azmcdfwsO+NaGXnoVNmRArPtUVmyeSakv6YQEbVcXSyIa1kcZ2BfRoQ2hSBhr7UZsvy1D5BUde4B5SuIyMbDXBdIXyFE6t8F+8bDaznEd/+Ps98Yav/6GuWM7NGvolq9Mm0RW3sXIoxF9nLAsRPuWaA+MQencHpmdi29HFuE2zVE3b8P5xkco63eAcgzGaFOhXbNHrYmvPq3lbsOe2qK2c13H/zj7va2hx8fB6i2I+okXynXbphEIO/8yY0MpIc6Dbdx9KH16IjdsxnjlfcydOYRHXoR+dn+0ZatwPv02otx/9C2jBBJjtyp9Op8jw/pW0a8X9gvOre3c1/E/TJXJGr0gA9EkFXHDMLfMLhhN8C9khACWhdKpDUr3TgCYP8+DSBgrLRWl3IsIhTA7tsXq1Cq66uJoEYA30FJu3XmV+fzjKKf2qO2c1/EXxlq7GWvjNqz5S7GWrsacNfuIZWh7/0f5aS7mwlUQF3MaXt8Z0QW9tZ3NqoimjcDhiOrbpQPG/OVgSYyObZE2GwiBldwA9Vj704aBLPaOUF5540NjwrRMa+k8lJP6VZ6+YczzDBvaj38/P5lgMAxEG2ynw0aP7q3Jyy9h+pQnDij68acn8sQjYxhwzi2Uef178iYEdpvG+o2ZDDqzBzsycrEqKhRVVWiUmsRjD13DilVbGD3qvIOqfv0tz1G/fj2WLttISWl5hW6S2Fg3p/ftTGZWPlu27SIc1iv1drscnNyrPWVeP++Pv5e77nsLIWDxsg34fKGDdi7sdhsOu43GjevTqnkj+p3Whcyd+dxw7aF7EPoTr4IlkYtXQbn/4BfaNFAURONURMt0RI+OUO4Dux310iGVl5nvfQIuJ+a0WVDiPcjLI8Bui257lNYI0bYFyqBTkTn5iG4dUNIaVuvVMGfNRvTshPXmJKw/N6JfeSdy9VpMMlGIQ2nbm8igkYgOrRBd2kNxCaJdK9ShAw8qs4oh0jwNx3vXKJHLb75CBsLuWjPCvXdw25dgGJAgQTRKQR3SH/ObX3BMnklo7CispEQw9GPXQQjw+tuINVvPkVt2/scsKqty2uVyYLOpIsbj6qWpSpoEiQS73SZtmrbY6bDvOphoh8MOxBMT4+pmWbKlrMiwEELabdoiIUS2x+Pq4vG42kgpLQCbpuF2Ozf17N5mTVysm5lf/86F55+6n+wXX/uMLVt2EhfjiomJcZ1iGGacREokeNxOw+m0/+Z02ktjPK5TbDatIRV6O512S9PUP+x2LQ/A6bIjEPExHtfpAmE/0LsgELhcdlRVLRNC5KqauuusgSeVnnfxQ3z34yJWrd7GA/cMP3DxOh1gWXbpcfVDyng4SM3psAN4UUQBgmzl/DML9MHXoQwdhP7Yy9ievCt6nd0GdpuKx30qutHggPIUBVxOSShciBAF2LSc8pM6l7kuGYN65QUYz4xHe+CWg74S5kdfoIwchnHdfUQuGIjj8Vfq47C3FSlJbUXSqY0Vz1lJBIJeLJmNx7UdRWxWb7gsQz/jKlMxLfR7/oXtxYcPKLvSEK3lczG/nI/146JmlHjPxLJOzPYWlQpUpOdygN0OlgmhCET0PW4JIbDWb0UWlyISE7B+W4L502/RAras6AMu86JuzqgZ3SO6IKdoqO3R6yfJjLzQ3qeyc4rwlgfE9h05/xcIhocDppQSt8shm6YnX5dfUPrxwcQWFJYCuezIyL2xpNR3G2ACCIFpt9uuTE6u96XfF2y2K7twQjAYjhFCSEDsyincccnwx4d7ywOLm6an7Cd39pzlFBaXcfcdlypnDL77oe0ZuXcbhrn7GavJDer9pCjKvJKScnX7jpyHQmH9vN16x3hcRptWTS4rLfXNAsjLK0YIkb49I/f98vJAUoUO+yGEQAh0m6aVr1y1ZUfvfrf+5HLapw45++Q1t9/1Ktff8hzvj79vv/tkfhFYVqzMyH4Rr68LgoP4xwQIdKlpAdZu3mX99PscEuOnqrdevdi49TFLv/oulJuuRK5Yj4jodjKzH5dFpWceVF70vQjLrOxysXZzhmvQyDk4HFM2XXbun60efQn9weexjbt3v9v02x7D2rANXSSjjr6xue2ca0da380dJv3BVuhGTPT9hcptYfILwzIzJ08/7fLZxMVMUEZcuNC4519muMu5qMPPR3vw1iryKw0xsnwHLFiDSE3qJ32hpifMCKUETUPp2g6lf29Eu5ZYMR78Xi/kFaKu3YS6YCVKTgEIgdyaiTnjR7Trr0C56BxkUQnm1h2Ehw/FSqiHY/q3KNuyosZZA7pJf6iv9cuSjjJiLIss/h1772grZBgmliXRDUPRdQNAlVKiayqWJRXzEEHxphmtNHTdrLx39zsihBCqonDR0NO+37Ite6bPFxwpK3oIpaXlLTZt2TXm9RdvX/7j7KXGyj+30K1Lq0q5s777g42bsvjsi1+7Ze3MvyEQCDmEEFRUEP6GqYmvff3dH6XpTZJte6ctpcQwTGlJqezuChuGiRBC6Lqh6rqhiEO/D2ooFHGW+4INiku8vYqKvdecftbY5zp2aPbOmnU7ItGu+HX7FIIFliUwDAVdByHUQ8knHHHiDyRKRelMSdkIfdDId8Up3Z/F6yuzPpiO6NIuWhlXT56bcMQtfcEUikt7k180suWQUS+I7h3fkkv/DOtPvIrt8T3rUyMX3ows8aJeMEiTy84dbi1b8xA+fzuMfRbC766qpISI5SAcSZfl5aMoKbvIuPquSaJF+jhapufqD96KueRP1F57dhWsfFtFkwYoX79ok77A+ejGibFCy0IkJ6Ldcz3ay4+hXnMZSu8eiA5tMTu2Re/Xh9BNIwg+fTf6BQOi3Q/dwPxwOsaEqWCaqGNGYjwwBqthMo5PZ2Gb+g01FnwgBATDiVZGbn/r81/QelUNBBd7/Vl55EgqMLH/AQEEAiEmTvo+0qplo1c8bmf27p66ZUG5LzDstbe+6Ddv/p88+9K0yjvXbcigccP6fPvlOLF1W/Yonz+UvNt4FEWhfv160x+896ofT+7Vnsq9YY9Gxb2KZu+sVrSMWJbE6w002b4j94XJ02bf/cZLdyoNUxNZuHjdkaUi9tFxd4JSQiCUJHfmPCgXLHtW9OnmJKX+/vdWS15Fofr8jWTGrues9z4Zq/3rH4jGqZWX6bc/Dm4nonGK3fz3W4/IzOx3KC1vV2U3CknVjnCVzbGBcCRB5hTcaa3Z9KFITmqnDhiOcf39WKvWV96yZ4z45ybk6s1pBMK9anTf0YNhSUTjZLSHbkM55aSq5xYvQ9uVjX5yT6TDgZXemPDNI5BJCdinfA3lAcx3pmJ9/yuiRRqaYaBt34WyMzda09ak7oaJ9IUGKT++8Zb+7dehYxdYDYRg9KjzuPKyM5efeuYdHwR35DxsmhZCQCgUid+ekXfTQ/deNX/V6q2RVX9upWuXlkz77Bd++XUF837/s0dxSfmlu1tRKSEmxrmzedPUl58aNzkipSShXuxRqRWV5SqpF+/5wjDMIIDL5agXDIabl3n9XUOhSEyF+oTDEXtOTtF9l139xKKc3OI5hYXeaiQAuBxhUT9hBhE9H4lAVZxI2VyWlXclHKkffTcrnktOwSjrh9/my8UrJ6uP3nFgmXabKRokfYOuZyClwG5LksFwS/yBzoQjrt3lTSisyZ25d+vX3Tsbf3CZ+fPv4HAg5/6B9vo/Ff2Mq/4h8woewjCr7kahqhKnPVu4XZlIWYBQXFLXGxMMNa+UD1GDL/WeLVetf1t0bT+C4rJsc+qsytMagL5mJea4dyDG3Z5AKPW4G6GU4HGi3jqyqhGGw1gLlmGOn4w9pwBG+dEH9kV6PEi7ncil5yIKi7F9/Wt0xm1rFnJLZrRZF0rUiS9EZTNv1YiuQJm/vTVhZrKAzONbMHtYuz6Dq657mrg4z7tFxd6hxSXlnaNFJyku9g6ZOPn7fhmZ+T/vyMjl6+8Wsiu7gN9+elXtM+D2W0OhSGWVrmkK9ZPi3/18yj9Xzpj1O+9MmHX0SiFxuxw5Y24c+sBNNzxdCAuRUoo335np+e7HxYM2bs56zuv1t4ZoC+kPhBIyM/OvXjTvzblTP/2lGtPYElyOgHLWaePMj75YZW76hRIgdebPTnPyjB5ye+bzlHr7VrY+Ed1OUcko9fGxX+IL+CsmdvYSJ8FmM8RJnV63Zvz0s7HtV9xSKuaz78Ravy87S2ZmP4/P34yowhAMpZCdf6H500fLtEduI9StA2qL/liLVp0r84vuxzBtlbKFgBj3BlE/8U1SG3yvDDg5Tzmle1DmFqjW7AXxcuP2XuzKvVmWlJ2LYaq79ZFFpQPYsPVh7YWHxlo//26YU2ehDr8g+s5aHbvCd4ugqKwbEcN+uOI6ZiyJ0r836qDT9zpmYXz0OfpjLyF37EIEQjjGT8Xx4XTQ9WgmHA4iFw9GNkmO+gkVBVQ1+lOi3TopYBMKW6U4kh7YwRFAOJJKcWk7mZmDvmb9sUqsFk89NoopEx/hg4++z2zcqP6rdrutsr8dCkfi8gtK73jy0etcnTu2YMbX8/l0+lwuuvzRk/ILSi609vKhxsd5Vnbv2ur9kTeMY/nKTTWhmsjNLxb/eu4Oep02hl3ZhbK0zOdbsWrzjKZpyf+0222RPY9UUlLm6zVm7CtJvy1YXT3pEmQoLJRLz6UMaFRYgtyVG6KgeIFolnYvDkdhlWt9/o7WH8ubyo3bDi5T14XSvzfOPzcgV623iOhl1g/zPhcNGzyDpu6pry0LQqEejh27bHJrJrY7n0C5/LxE8oseIBypujthfMxC0b7VZdbCFW8I2IJhlMvFqwwKSsJAPiVl3yjDzhkh0hq9vW8asrDkauOpN/pZ381FrtsMVIwRxdw5KEULbBjWSbtnH48b0cBq1CEDwLangpE7s7G++AGlZyeU7h2Q8bGY3duj/bIQdUdW5cyo1aQhxsld2Xd2WgAG8EFIZXipxvAyG/+JaNRIX9IwnQT0bixYDRtPjCECfPzJz9wxZhiDzuj5Wb14z4+VZSWhoKB04HsTvx3w+YxfSWvcgJ+/eUHZnpF7fSAQTtrdoXHYbUbjxg1enfrZnF2TJjzIk4+OqjnlJCyZ/zZNGjegSeMGXHJRPzq0azrP5bJnyb2+ZWLoRkppqS+5aB/3T3VoCIj6CdAgEeXCQShD+q8QHtee3aEFoBvxFBQ3lLkFh5WndmmH0q0DonsH1OsuQTRtvASHo3zvb69If9BlTZulWivXYc1ZiFy7ebD0+k6uIsjlzBHN0u5iV+4aR/lqRJ9uaLeMQB11GeqV56OOHAZ2G3LD1nJlUN+HRUL8N1VahFA4jsLi67V3/62RVA/YPVmTlQ2TP48jYrSo+kGY44C0EKkNEG1bVj3u9yP9AURyEnjcSLuNyCWDiYy8EOlx7xkAKypG53bRiZt9+NJUecanslOHHTq8WK7wJwpqNdQ6JJYE3ejo2D5f0PzELRYeccUg8gtK+OaHhd5mTVNfdrkcZbuH78FQxJOZlTf6/CGnOOb9vpqLrni0T1mZ/+K9jSApKe6noeeeMv32my9k2me/HDc9r7v6nN0z9+VA6Z4ZVomiKC6PxxnrdDmOWr522blg01CvvywsTSt/39PY7TFEqu87tnbsjAYK2G0WiqjS8giH3RTdOkjRsim22ZNtlHkvRtf3zKUIgYiPnRKc/tZC5YbLsaZ8hXb7NVXkK+1bYf9+IrLUizVnoZemjV/H4fBVXiAl0hcYYD4zvqVcuqYiEwAZOYBMIBypz/FGSkRKIiI2purxhqko7VtjfjMXYdMQNi1qjMMGU+WLUVIiU+oj3U5EmQ+EQAWWSYXny1XKrT1TwREJoZqISpASEQg1sZYtdIrckuDhLlcUYUZ0g5NOO/DC4j8WrkV4zoRqDGN7n9SODu2acvONF/wy8Nx/TAuFCm/ebWxl3sDZCxevO+vnr5//5uT+t40JVTw/KcHjcZY2TU95cepnc8ob1I/n30/ceHyeJ/D5jHnMm78KRSjxQKKUkqgxCizLCvj8Qa88hpBD85s5yM3bMf8zzSVUJXWfvpCBrpfvNz7cj+h7YM78CfOVD6K1mcPelFDEUzknEj22ZdfgfuGGtz2OuWBZA+n1da4SYeaw+2mU8rXrvBuQW7PQnvy/g6aoXjIYuSsPXI5FVsauNTIU7lOZTjiSKrPzulLi3Wit21xhiIUloKmJ6EYMJwKXA9Sqfj5RLx7twVsxJ3+B+fMCRIkX17jx6Of1JzJsMNLlqjRGqdlAUSuLt0AInvOrZOhUtn4W0FSDVljHvnhEAhE9US5f4wT2GOI+Nh6dvrfIzStpZxjmyZqmHLQxPr1vZwqLvGn7n9ntFY5y+y3DuP/Rd7l29DNm61ZNXveWB4aUlfnThYBIRPfkF5TefM2Nz5QXFJYOsSyJEKCqgpTkhE9nfPLU3HcmfM3A/t2Y9fm/avwxzp23ku9/XEwwEOLH2ctompbSJxSKNNnb52izablJifH5RyPfXLAcuWgFuJ1Yvy5GxMV0lqFwp0rDkIBNLRX1E7MPaYhCWOgGkUtvw5o6C4IhxBl9GluzF9yOru+50W6LkBD/U+pplyMzs8FuSyOip+5xU0hw2HNE8yabEQLbIYwQQL36IqzCYrz1E73uflcuRYg+lQ2KaaqEI52tJfM+pUFS1BBliQ8R62mAabmOvyNfgDcAugHaXt1LXUfUr4d292hkiRdz0SpkvTjsH3+NTKxHZMiZlYYoQqHKMDZTwLshlXlBUaULqgCXuCwaCXlM8d8VTwBMq54sC8eiKiWHujIS0Vm1eut9wN2Hk2pZslr9tSFn9WbklWfRqWPztacNGjs+EAj926jwlRYVlZ22aUtW/O6xYdTF4N7RumXj14Zd+ZjZpVMLWrdOq04y1S6MtCbJ5n0Pv8PD978Awo205iufz/itz4aNmQ+Hw3rlQ1UUQf2kuKVvvnxn8adfzOWtV6ohXYBwOS1zxk+Y/34ZHLE4wxvQr7+/nbV20xMEQomVhiFAxHhWif69Myg9iHtESkGZr6kMhloDKjYthvoJnayffx9FWXm/KkknxP+onNrzZ1lcipy7CJyOBExzzx5NQiBUNU80SilFr15XWK7agCu5F3hcO1EEmHt6dgjR1CGLhDV3oYwaos+LdAk3lnXMw6nDF7RA5hZEw9Qa73GzyLXrMV59H+XS88BuR8bFELl8CM5XJqJs2QHSqrxf2ZmNCIRQheA7Q2WiP/q9093PxwROdUmusJvUzFpKgTR0zSrMVFH3qqgOIFtK0HXDISWHNbID13n7Cx3QrxtvvjODa0c/g9vtfL+wsPTC4pLykwFCYb1e1s6C03d3V202lZTkhLcnv//Q2h2ZuTRLT6UmiUT05I8+/vGhdm3T/e3apAufPyi69L6xlc8XHOAPhCoTk1LidjuLUlMTP+x9+q3y/HP7VC+BsO6yFq64XSTVyxaDz1IIhAiH2zeylq85E1+g+Z4hCuCwRUiM/9B89p2geue1By7gUMhmLV39IhAGkEI40Y1YDEOpcl2sZwmNku+zvvi+nOT60cnBBklJ5OTb2Dtazm7TRYs0SxaVVis7Ij4W4mOg3F+w36PVDScgZFZO1BAJBFE8DZMtUXPfSzwoikDmFWGtXIvaeK9o98REZF4J5vufg6IiQmG035ZCKIKVmhz1E0oLIhG0pWtQDJMtisYLfpVSc0+XVAL1NbjLY5GKpMY2+LBwC9MVR+TwElVVQalGiJ1pWljVnKW+7eaLgJY073ByXotmjV7xB0ITw2HdURGetqcYE2KX9Ond/sPOHV9m1jcLair3QNQ3WOb11y/3Be7ZXe1JKZH7TPBJKXE67VZ6k+RXp095Yv6b785k6Hl9efyhwyYAgaBTbtg6urJalXvND+xJAGwaolHyJOWcfl/KTm2jgRwHwpKCYLhelSiYvStAuy0gEut9T4u0R9iauX7Hgum02rgd/Zq7EUUlZViWAezpuhmGIvOLBP5AtcpM7swFXxBax9Qjv7DqSZtmAYikhIoxYkkYWRhSKpvN441uYM2ajXJ6b0Rc1D0j0hujjroUc/xUZKkXIQTaHysxTu6CMaBPtPBVBW3tBrRla/ErCi8FVNaFqdIlFQJGxlicqpg1mB0JKDYUpxPL2Cux/a+02zW6dGr5saapi6SUB+1hKIqQW7ZlX1ZQULrPEoqqY8S9+WLmRBYv20DTtJSvxr8365vcvOIqs6QOhy3YpHGDFydN+SkvP2MNUCN+w/2I+in311FKiaIoeDzOovQmya9cdcXAl+667y2ZkBBLepPkI0jgwPKRMhq04XQGRP2ECcrAU5+UK9eHcNghtcHB5Sl7GXVVIzRF87TXlJHDnrQmfRGMLPicll/9jNK2OZGzrwW7VoaiRKDCkS8l0pJJ5BV6EKJalvjrRWdxCqC2a5FcZYwU7Q7l+YWw3KvWRw1RxGiIeLuUx7K9xJGgKFjL12JOnYk2+qqKiReBevF5iPatMV/6D2ZGNuHRV2Cc0gMZ44l2SQuLsU/5ClHqZaphZ1ZQVClXE+jjhFF2E1XWUGRNJQeomg9QUauqSqOGid8uWbZxSkHhwX1n2VuzaNutbWtgH0M8eO1x8YWnc+W1T/H7gjWB5s1Sp5SUlA8NhSOVU+uxMe5VZ/Tv/t3JvdrTs/s/GHresWySfOB3QQhQFHW/OFNVVYIOuy07MSH217QmyRM/+/jx+Xfd/5YMRyI8/tA11UyzAlWlygRJdAYqgqblihj3H6Jp46nKkAHfWktW6TIcRnv0DqwZPx5Ylt1mikYp0wlHtmKaHWWJdwh6xTg2oqsyK/tS6+OZX8u8ot9tvYehDh0Uva9eHEAWqloE+p49xMKRRnJbVjq6XmC8/THamBGHzEr/CZ9C8zSH+ciLXaq8PooAm229rXk/sKyKFjHODUaokOi7e/y7pwCmhTl5JsLlQr1yaHTpk6qgdGqHvOdGgrm56B3aR9ejCVByC3C89wn2ZeuZJzVe9ymE93JVSCBRhbFuk4ayBrukAAiEkAGBtwzt8M2sYVhqUmIcqxa9d8Dzd/7jDV574Xag7RGX9XmD+/DZ9Ll4PC6foghr77BgVVX8HdqlR4qLy4/RCHeXaFVjjMapxhV27NDsQ8uSfkUgIroRDIf1XI/bmZWQELvx/fH37up/9l3WhA+/JSkxlkcfOAIjlBJiPSHRsc0kIBshFLy+MnS9mLiYXBEbs1EZfWWmOfYJw9q4FQwT+8evwMevYLz8/oHl2WyG6NruXWvektnaw7d5zJfee0fmFIyoNIpAqJXMK3ha6d/7Ury+Iv3CN7E9fBtKt/aQGJ9nZezcLIOhqPM4OuZMkFsz+1lL/1xW8NGLh8yO/vALmD/MQ2haa1nu715lttduKyM+doXo2h6le8cKQ3THgXQGEMqJM0QhIBDCGP8xclsG6pUXIFo2j0bbdGyP0bQJRCKI8nK0leuwf/49tnVb2SIUnvZr5BgH6JJ6LPorZg0bIdGSs9l0klLD+7pdTjQjh5/FBZc+HJ0NPECp6rpZZcxY02iamj/03L7/vvuBt4qLd20FpR4durUmNSWBhIQYpnwym2EXnsaN1513dAnYtKDSqfUb5vQf/pTLFiISGkOLtGiVEONG/jAPmjVBHT4UpVOb6snUdUXp3AZzykw/zdOexes/DZ+/aeX5Mt8AuXrjmOBPk56O+fIHzD83oHRuS1ikBJWzh/xASdnAyjGoaSG95dep1178eapvcJYeCKH+cyxKx9ZVkjSeHQ+6gfbJ60LvP3wUoVBqldne2JjVSv/e6/EHYUaFQ1/G2pF2UYwqwki0E7YyXwgIG5hf/YL1xwpEpzYo7Vshk+phK/dBdh7a+q1oWzIRoTBbUfmnT2NlqKoRmkBfp+RGp4lW413SKFKIculyBGpkneN/NyJzZ556z52X8/D9I8CCdcvns3uR0wfvHKN0CTIQUpRz+mFb9hWU5MOyFftf98nrRyxae/Jugu1brradNfJ1GQo9X/kNF9NE5haMcV18y/fmm5OWklIfrrkY5ZJLwWb7nLyC0fgCeyyt3N9Frtn0tHL+mWOtuYtKrQXLkFJi/bECuWQVysC+mK98QPC9Z3D+tmS4LCq5scr40KaZJNb70Hz0Ja+9ZCU8cEtFi5hYD6AIVfWD9JzIjWqiARgKFJYif1mINWcRQlFwI5GWJIhgi1CYrdv5NKiwMVK1ybaAFA3+4bZIrfEu6V5K2rVi2aqxH9+JWQlVR81jzV+K/bbHwO36QJZ6z6e4bEDlyUCoETkFjyiXDL5a5hT4rA1bUZ+8i3DH1tu1s699V4Z2PothRl89y0LmFoy0vvwxjiYNx4m2LVYFhQirqb2RpeU4gusEitrQOWD4KLkz9y5C4SoB4yIuZrbo3PZz0TwNa+4ioKJFFA1TwLJKpN1WAhzB9Fb1UCp+UkQNxyA6MWYpInpMgmEJdE3BJ6EIQbYl2GwIVumCPyOCPOPAA1hNwE0xFn3Vmpwl3R/hsO+0D7kgaMybc/wSqeO4oo2+gsg510IgVCzSGj0vg6GeBMOVizNlifc8a84fI63v5r3tMDdjvvYhtpsegoT4d/GW95ZFJZdVtmyGKWR+0UWUlfc1H3x+uTZo5J+4nCUiErHpA4a3kl5fL/yBdpjWnlZNAnGenTRP+6dc8mcppV7UN/4Z1Q1Aa9sckZ5Sqv+yJEsK0bamMi4q/tiBwjJdkGEJCkwoQeCLSEybwFQFpgX+iCQkBOUW+CzwS9CtCsdBhax9jdAEznNLrrGZCFlDvvsDoSgIt3NzUDS0XDLneKVSxwlAOf9MMEyUSwb/aIz4v8kyVDCmcuJG1zW5M+8uZcSFc/ShN22gXlx0x7gyn1f06HQ/K9clyoKigZXGKCWEwskyt2AwQgxGUaLHDuYbjnHliEYpd0Y+ef0P94atyJx8OOOrqF4AonlL/O26hlDE8poKcRNEgzIn6BojSjXGlqo8U6bwnk9huk/wQ0ThZ59gbhn8Vg7LI4L1YdipQ5kZ9c8qRMeCB9LIBLo74AG3SXx0I7Ljh6YY0mVbpQ4bjLVy+fFMqY7jjHbHtciycox7xxk0bfIyMZ7NVS7wB1qzI+s+5frLbKJxCspFZyPn/IFcvXG76NTmGpHaYAIOe3R8su/2GKa5vxFW+L9JiF8mWjYdqX/7/pfO/0zDWrgC9YxTKi+LNjLlfuxDr0UmuJdjU2tkmGUIGB/WeLJUYUskGmKnEm2CK38C1N0/9nRhD1cVmEC6Bo96DFpjHZfJmT0FCdi1AmKca2iaitq9Z5XTYq95o72C+EU1K7R9N2VSQVS3KhSAts/FKqIaBRh1v+6ltwCBVuXO6B40AiG03RpV/K1W5PDY2HN/1cnB3XoclXwB7LVpVFRfbd8Na2z/HItt2muYk1/aLFLrv4jDHt7bbykLS66yxk8ZZr45CQIBbDPfxZq/BFlclq2Muuw20arZtSI56RfcTt9BJ++ie6gaJMRvEKkNHlH6dBsmt2TMdn76DZSUoV13aZXLNQClRxf0h58ERVlt7cgvlGE95VhaRhX41VR5x68QljXjD5FEx4h2Aae4JPe4TPoq1vGZnKlSoCA8ro1q3y47KSmvPOxy2tE0RbrdjpkIMiG6zMPlcuBw2Ne6nAdfDeCoWEvpdjl+jER0f0XWEAjLbtc2WYeJUnc67Tgc9m1ut/N5IYRa4ZtS3G7HJk1VDE1TD3mv02EzPW7np6qqrKnU22k3TdPasPuFdDpsCCHy3S7HK6ZpeSo2gxNutyPPbtMC6rG6cex2sKygcLvek4bZKKqHFMLlDAi7Le+II/VtGthUA5dzCm7XkmiZSoTbaWC378BpVLnc/M80tLuehvjYiSiKX+YVdq1c0yhQ0XWn7cvxirVopaWc0h3jtQ+R6zbB9qyw3LLjU3XMiG/lguU9ZG5BHyJ6dwyziQyGFOGwS2xaIXbbFuJjF4mWTf+IvPTwTnvbB7FW/4zMuRztvpv3U78yKkO0TUckx2+3lm1YhRBnH0sZB4VgSlih2Nx3B+MjZ7cBxqvQ0yEZ5rAYZLNIkvL4toS7UQR4HPPCl93gdwe2wE3Rw9sz8igpC8r1GzMnW/7Q5KiyEuFx0rxZKtu2Zx9UZHZOEQAbN2d9ESj2flHZxRFEAxjMQ+dsx45c6tWL2bhhY+YDlj9YUfNLSsvqU+b1U1xy8I2admTkEh/nMddvzJxAxQ7lSIk7KZ6BA3pUxr5m7cxHCJGzYVPm43qZv3IHteLURPIKStDUY1sfILPzwLL8cvP2F2WJt8LRLSEpAdm5LUe8QL2wBMIRXW7ZMV7mF+1xnMd6EM2bIPfZTVy7aTj6TQ9BRA/LrRmT5cZNk7G7ozcJBQIh9ItvQTn3jOj1FUHl5pyFyLc/hrJynwyF51mLV81z+NYo5rvTXHL5GkTrZihXnh8ONWloaH0vhWZNcP22FGvNRlzoMPbAuyRUNntB1ynQxIXSq819cmvOs0e7JaECbEThilKNHP3oW8PdBpiswUCn5GKHRU/VIrbCAE9IVKwE3I6A6NriAoKRX7TrhqL2G3jMYuv438DasBXRtgXW9O+RO3OR6zYjmjVBpDeCFumg66j9T66WrMoGyz7zXoyvl4DbOZddRcWUBxKPpnuqAJtNQZFx9EZoEg1XG+KSjHCadFUs7DLq5jihn0sVgMe5jjbNVxEx6oywjioo7Voeu5Ddsnb/Qz37YujaCs7vs4p4z4KjHSNKIEsKIkfRZEmiPcEzXJLx9Uyedev0EhZqhQGe8M80qgokxn1ljX2sSPnHHccur446DkKVIZzx2mTUuMSwaJM+VRaUDSaiH/kQT0DpUazHtYAkFW6KtbjGbpIkJeaJbgH3RkqIdeeJ1mlfiQfuQP7wbW1pUsffgCoj7ieXfoeImIjGKblk5Q0kEGp0pAKFgHmoLApWf5WxBbSxw7g4k+E2E9dxihc9spJREA0bTLW/9ewHQurSds7g2taojv9hqrR4Wlp7NgNNmp1aoPQ/6QNKy3se6XcwhARbxIJqbmJoAd3tkmfiTbpjYR7PCJnqIgG3s0g2TpoQvvkeU+vXu7Y1quN/nP0areY//Yx6/YWIrq0+E/ViFh2pQCGgnj1qu5Y89M+Q0NYBz8VWGGFtl8ZuVIFITZwhX35qqRzUC6VH59rWqI7/cfYbA2pnDcLfeQhqPXeB0ib9VVke6E4w4qhupIOU0FyVtHULrMP4guwC7nOZdFWtE7ZLx+EzACLWk6E0a/QKN91rml2ao1zesba1quN/nAOal/nbHOSqTYgWjZ3G+OkTZHbhVUfiYA0rglJFHLaLqUpIsiyUv4oRAtg1lA7NHwxOePmZ2F1bIQxKi5qbpq6jjgNx0HZOf/IFrLwCiHF1kcs2zqSkvNmRCj5cI3qQLYJqsTQEIi15jrio3+UUlxeqzZugXnRRbWtVx9+Ag9qKtfIPRNc+BEVDtNEjbrTWbX/jSLqo/3VIEAkxO0WfTleQkbsAhx37hJdqW6s6/iYc0qyMTz+DEi/KKV0c+rj3X5Fbs2/B/MtMqdQcEnDZg0rrJrfpEyd94CpZjpmZj61r9cKT6qjjWDls+6a/8DpWcRkkxafKX5d9SHbR2cf9i1EnGpsGLRq+qD5/64N8u1AXcfFoV1xe21rV8TfisIZo7cwmcuvD0c+lNUzqwLINk2V+Ufe/1uDuGNBURHrqVHnu6bexK69EcQns9xz2sxV11FGjVGvEpy/6lbKT+xNzzpWoPdr1sFZs/kAWlnX5rzdGVUE0TvxMObP7bVZGYYElNVwvPl7bWtXxN6RaUWi2k/uTMH8eju+nYq7JXE6XljfSIGHN8f9y1HFEVaFJgy/Eae3vkNtzC0RJKfaRQ2pbqzr+plR7pZJ6Wj+sHz/H8dUE+H3lEtG19UiRkvDbf90+n9GtLyyR1uB9Tu0+Rm4vypO5BajXDETtVhfKVkftcERWpJ5zGZEFv2KfPxO5PXel0qvj1aJpyqfYNflfMYEjAY/TL1o2/pd6xcCxoqg0XwYtxP3Xova/qLa1q+NvzBE3Z45TByCX/o75yadYhWWZ4vIzbxJtm/6LOE/Zkco6sTkViAbx20WH5mO0SW88IXfk+hRVwX7zQOxdT69t7er4m3NU/Uql12m4s5ZDPTdkFZTZP3jlcaV7q+EiJeEPNPXI9xs53jjsukhP+Uw5tcsw453pk8xpU00Z78H21EMovevGhXXUPkc9wBNp6TiefgQlJQnrp+8suT7jO6V/92GiTdpTJMTmoIjajV+TRF0TDeLXKB2bj9GuP/c6mV+8yi23oqY2wH7zTbWoXB11VOWYZ1q0q0cgGiRhfr8A/ME8+0evP6ac1P48kZbyFrGu/Mrdj08kmgqJMZtEy0YPKad3P9eaNX+CtS07gMuGXPcH6hlnnVh96qjjMNTIlKfS/WTcbIdTO2NuWgqB4Ar79P/cIXq0O4/WTd4iMW47mhq1xuNhk5LoQkiHLUJyvZW0S39E6dP5HH3KhHEyGM5y5CyEXh2xP/80Ssdj/W5gHXXUPMe67WgVbOcMBUB/6x3ML6dblAeWOj5+c1nksX81IyN/sCz1XUCptzO60RjdFFU+wltdn+Te1ysK2FQdpz1DJMYvIt7zhezS4jc59o4C7nscjyzD+vLb6u+dXUcdtUSNGuJubLdGdzKOfPIp+uL5ElNut35d8rby8bj35affpSsho6/0+vvgC3aRgVAahpmEbjqwLLXSOHe3nLs/Jy4EaKqBpgaxawXC7dpOrGeliPcssBI9i5UnH8kxh4wwaZuOJiXWD98ghKu2y7eOOqrFCWkqzDVrUTp2IDzhQ1i5FjZksOnnT2n/1Rfx1opNjQiGWlHmayLKww1xKQ1leTgGvy5RBCLZLTAoRIp8GePcRUJslqgXu03t3zPHd9JpAeelo5Ht0hCn9ERfuBj36NEo6U1qu1zrqOOI+H/k3mDXANvXfQAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMS0xMi0xN1QxNDoxMDo0OCswMDowMFulGA4AAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjEtMTItMTdUMTQ6MTA6NDgrMDA6MDAq+KCyAAAAAElFTkSuQmCC\" alt=\"\" style=\"width: 25%;\"> <br></p></div></div></div><div class=\"layout one-col fixed-width\" style=\"margin: 0 auto;max-width: 600px;min-width: 320px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;\"><div class=\"layout__inner\" style=\"border-collapse: collapse;display: table;width: 100%;background-color: #ffffff;\" lang=\"x-layout__inner\"><div class=\"column\" style=\"text-align: left;color: #60666d;background: #edf1eb;font-size: 14px;line-height: 21px;max-width:600px;min-width:320px;width:320px;\"><div style=\"margin-left: 20px;margin-right: 20px;margin-top: 24px;\">\r\n                        </div>\r\n\r\n                        <div style=\"margin-left: 20px;margin-right: 20px;\">\r\n\r\n                            <p style=\"margin-top: 16px;margin-bottom: 0;\"><strong>Hello [[name]],</strong></p>\r\n                            <p style=\"margin-top: 20px;margin-bottom: 20px;\"><strong>[[message]]</strong></p>\r\n                            <p style=\"margin-top: 20px;margin-bottom: 20px;\"><br></p>\r\n                        </div>\r\n\r\n                    </div>\r\n                </div>\r\n            </div>\r\n\r\n            <div class=\"layout__inner\" style=\"border-collapse: collapse;display: table;width: 100%;background-color: #2c3262; margin-bottom: 20px\" lang=\"x-layout__inner\">\r\n                <div class=\"column\" style=\"text-align: left;color: #60666d;font-size: 14px;line-height: 21px;max-width:600px;min-width:320px;\">\r\n                    <div style=\"margin-top: 5px;margin-bottom: 5px;\">\r\n                        <p style=\"margin-top: 0;margin-bottom: 0;font-style: normal;font-weight: normal;color: #ffffff;font-size: 16px;line-height: 35px;font-family: bitter,georgia,serif;text-align: center;\">\r\n                            2022 ©  All Right Reserved\r\n                        </p>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n\r\n        </div>\r\n\r\n\r\n        <div style=\"border-collapse: collapse;display: table;width: 100%;\">\r\n            <div class=\"snippet\" style=\"display: table-cell;Float: left;font-size: 12px;line-height: 19px;max-width: 280px;min-width: 140px; width: 140px;padding: 10px 0 5px 0;color: #b9b9b9;\">\r\n            </div>\r\n            <div class=\"webversion\" style=\"display: table-cell;Float: left;font-size: 12px;line-height: 19px;max-width: 280px;min-width: 139px; width: 139px;padding: 10px 0 5px 0;text-align: right;color: #b9b9b9;\">\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>', '{\"name\":\"smtp\",\"smtp_host\":\"smtp.mailtrap.io\",\"smtp_port\":\"2525\",\"smtp_encryption\":\"tls\",\"smtp_username\":\"f5176b7c09f10d\",\"smtp_password\":\"d9f04a14770379\"}', 1, NULL, '2023-01-06 06:54:54', '500.00', '900000.00', 0, 10, 1, 1, 0, 1, 0, 0, 0, 1, 'Your Tawk code and Widget ID', 0, 0, '1826868814245944', '1826868814245944', 0, 0, 'G-TFQZ8YZ468', 0, 1);

-- --------------------------------------------------------

--
-- Table structure for table `contents`
--

CREATE TABLE `contents` (
  `id` int(11) UNSIGNED NOT NULL,
  `name` varchar(191) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `contents`
--

INSERT INTO `contents` (`id`, `name`, `created_at`, `updated_at`) VALUES
(7, 'counter', '2021-12-17 09:59:33', '2021-12-17 09:59:33'),
(8, 'counter', '2021-12-17 09:59:33', '2021-12-17 09:59:33'),
(9, 'counter', '2021-12-17 09:59:33', '2021-12-17 09:59:33'),
(10, 'counter', '2021-12-17 09:59:33', '2021-12-17 09:59:33'),
(15, 'service', '2021-12-17 09:59:33', '2021-12-17 09:59:33'),
(16, 'service', '2021-12-17 09:59:33', '2021-12-17 09:59:33'),
(17, 'service', '2021-12-17 09:59:33', '2021-12-17 09:59:33'),
(18, 'testimonial', '2021-12-17 09:59:33', '2021-12-17 09:59:33'),
(19, 'testimonial', '2021-12-17 09:59:33', '2021-12-17 09:59:33'),
(20, 'testimonial', '2021-12-17 09:59:33', '2021-12-17 09:59:33'),
(23, 'faq', '2021-12-17 09:59:33', '2021-12-17 09:59:33'),
(24, 'faq', '2021-12-17 09:59:33', '2021-12-17 09:59:33'),
(25, 'faq', '2021-12-17 09:59:33', '2021-12-17 09:59:33'),
(27, 'faq', '2021-12-17 09:59:33', '2021-12-17 09:59:33'),
(33, 'support', '2021-12-17 09:59:33', '2021-12-17 09:59:33'),
(34, 'support', '2021-12-17 09:59:33', '2021-12-17 09:59:33'),
(37, 'how-it-work', '2021-12-17 09:59:33', '2021-12-17 09:59:33'),
(38, 'how-it-work', '2021-12-17 09:59:33', '2021-12-17 09:59:33'),
(39, 'how-it-work', '2021-12-17 09:59:33', '2021-12-17 09:59:33'),
(40, 'how-it-work', '2021-12-17 09:59:33', '2021-12-17 09:59:33'),
(56, 'social', '2021-12-17 09:59:33', '2021-12-17 09:59:33'),
(58, 'social', '2021-12-17 09:59:33', '2021-12-17 09:59:33'),
(59, 'social', '2021-12-17 09:59:33', '2021-12-17 09:59:33'),
(60, 'social', '2021-12-17 09:59:33', '2021-12-17 09:59:33'),
(61, 'blog', '2021-12-17 09:59:33', '2021-12-17 09:59:33'),
(62, 'blog', '2021-12-17 09:59:33', '2021-12-17 09:59:33'),
(63, 'blog', '2021-12-17 09:59:33', '2021-12-17 09:59:33'),
(64, 'feature', '2021-12-17 09:59:33', '2021-12-17 09:59:33'),
(65, 'feature', '2021-12-17 09:59:33', '2021-12-17 09:59:33'),
(66, 'feature', '2021-12-17 09:59:33', '2021-12-17 09:59:33'),
(67, 'why-chose-us', '2021-12-17 09:59:33', '2021-12-17 09:59:33'),
(68, 'why-chose-us', '2021-12-17 09:59:33', '2021-12-17 09:59:33'),
(69, 'why-chose-us', '2021-12-17 09:59:33', '2021-12-17 09:59:33'),
(70, 'why-chose-us', '2021-12-17 09:59:33', '2021-12-17 09:59:33'),
(71, 'why-chose-us', '2021-12-17 09:59:33', '2021-12-17 09:59:33'),
(72, 'why-chose-us', '2021-12-17 09:59:33', '2021-12-17 09:59:33'),
(73, 'testimonial', '2021-12-17 09:59:33', '2021-12-17 09:59:33'),
(74, 'testimonial', '2021-12-17 09:59:33', '2021-12-17 09:59:33'),
(76, 'how-we-work', '2022-05-11 01:44:17', '2022-05-11 01:44:17'),
(77, 'how-we-work', '2022-05-11 01:44:34', '2022-05-11 01:44:34'),
(78, 'how-we-work', '2022-05-11 01:44:47', '2022-05-11 01:44:47'),
(83, 'know-more-us', '2022-07-04 23:41:17', '2022-07-04 23:41:17'),
(84, 'know-more-us', '2022-07-04 23:45:49', '2022-07-04 23:45:49'),
(85, 'know-more-us', '2022-07-04 23:46:23', '2022-07-04 23:46:23'),
(86, 'know-more-us', '2022-07-04 23:46:56', '2022-07-04 23:46:56');

-- --------------------------------------------------------

--
-- Table structure for table `content_details`
--

CREATE TABLE `content_details` (
  `id` int(11) UNSIGNED NOT NULL,
  `content_id` int(11) UNSIGNED DEFAULT NULL,
  `language_id` int(11) UNSIGNED DEFAULT NULL,
  `description` longtext DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `content_details`
--

INSERT INTO `content_details` (`id`, `content_id`, `language_id`, `description`, `created_at`, `updated_at`) VALUES
(13, 7, 1, '{\"title\":\"ACTIVE CLIENTS\",\"number_of_data\":\"320\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(14, 8, 1, '{\"title\":\"PROJECTS DONE\",\"number_of_data\":\"850\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(15, 9, 1, '{\"title\":\"TEAM ADVISORS\",\"number_of_data\":\"28\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(16, 10, 1, '{\"title\":\"GLORIOUS YEARS\",\"number_of_data\":\"8\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(28, 15, 1, '{\"title\":\"Data Analytics\",\"short_description\":\"Favourite tolerably engrossed. Truth short why she their balls Excellence super powr sed eiusmodsed do eiusmod.\",\"button_name\":\"Read More\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(29, 16, 1, '{\"title\":\"Website Growth\",\"short_description\":\"Favourite tolerably engrossed. Truth short why she their balls Excellence super powr sed eiusmodsed do eiusmod.\",\"button_name\":\"Read More\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(30, 17, 1, '{\"title\":\"Smm Ranking\",\"short_description\":\"Favourite tolerably engrossed. Truth short why she their balls Excellence super powr sed eiusmodsed do eiusmod.\",\"button_name\":\"Read More\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(33, 18, 1, '{\"name\":\"Maria Jacket\",\"designation\":\"Web Developer\",\"description\":\"We help organizations across the private, public, and social sectors create Change that Matters Welcome fat who window extent eithe formal. Removing welcomed civility or hastened is. Justice elderly but perhaps expense..\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(34, 19, 1, '{\"name\":\"Alica Fox\",\"designation\":\"Team Hunter\",\"description\":\"We help organizations across the private, public, and social sectors create Change that Matters Welcome fat who window extent eithe formal. Removing welcomed civility or hastened is. Justice elderly but perhaps expense..\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(35, 20, 1, '{\"name\":\"Donald Trump\",\"designation\":\"THink Tank\",\"description\":\"We help organizations across the private, public, and social sectors create Change that Matters Welcome fat who window extent eithe formal. Removing welcomed civility or hastened is. Justice elderly but perhaps expense..\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(43, 23, 1, '{\"title\":\"What About Loan Programs?\",\"description\":\"Lorem ipsum dolor sit, amet consectetur adipisicing elit. Temporibus adipisci ullam quos voluptate officiis ab exercitationem? Molestiae deserunt incidunt, inventore cumque explicabo rerum accusantium dolor natus quas eveniet ad molestias!\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(44, 24, 1, '{\"title\":\"What passages of Lorem can i contact you?\",\"description\":\"Lorem ipsum dolor sit, amet consectetur adipisicing elit. Temporibus adipisci ullam quos voluptate officiis ab exercitationem? Molestiae deserunt incidunt, inventore cumque explicabo rerum accusantium dolor natus quas eveniet ad molestias!\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(45, 25, 1, '{\"title\":\"What passages of lorem can i contact you?\",\"description\":\"Lorem ipsum dolor sit, amet consectetur adipisicing elit. Temporibus adipisci ullam quos voluptate officiis ab exercitationem? Molestiae deserunt incidunt, inventore cumque explicabo rerum accusantium dolor natus quas eveniet ad molestias!\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(47, 27, 1, '{\"title\":\"Temporibus adipisci ullam quos voluptate officiis ab\",\"description\":\"Lorem ipsum dolor sit, amet consectetur adipisicing elit. Temporibus adipisci ullam quos voluptate officiis ab exercitationem? Molestiae deserunt incidunt, inventore cumque explicabo rerum accusantium dolor natus quas eveniet ad molestias!\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(63, 33, 1, '{\"title\":\"Terms &amp; Conditions\",\"description\":\"<p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for \'lorem ipsum\' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like). It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.<\\/p><p><br \\/><\\/p><p> The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for \'lorem ipsum\' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like). It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for \'lorem ipsum\' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).<\\/p>\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(64, 34, 1, '{\"title\":\"Privacy Policy\",\"description\":\"<p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for \'lorem ipsum\' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like). It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.<\\/p><p><br \\/><\\/p><p> The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for \'lorem ipsum\' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like). It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for \'lorem ipsum\' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).<\\/p>\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(71, 37, 1, '{\"title\":\"Register &amp; Log in\",\"short_description\":\"<p>Creating an account is the first step. then you need to log in<\\/p>\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(72, 38, 1, '{\"title\":\"Add Fund\",\"short_description\":\"<p>Next, pick a payment method and add funds to your account<\\/p>\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(73, 39, 1, '{\"title\":\"Select a service\",\"short_description\":\"<p>Select the services you want and get ready to receive more publicity<\\/p>\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(74, 40, 1, '{\"title\":\"Enjoy Super Results\",\"short_description\":\"<p>You can enjoy incredible results when your order is complete<\\/p>\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(95, 56, 1, '{\"name\":\"Facebook\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(99, 58, 1, '{\"name\":\"Twitter\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(101, 59, 1, '{\"name\":\"Linkedin\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(103, 60, 1, '{\"name\":\"Instagram\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(105, 61, 1, '{\"title\":\"MyBTC Ca Welcomes ETH Here\'s What You Need To Know\",\"description\":\"<p><span>Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore is dolore magna aliqua Ut enim ad minim veniam quis nostrud exercitation ullamco. Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliq Ut enim ad minim veniam quis nostrud\\u00a0<\\/span><span>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliqu ip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. <\\/span><\\/p><p><span><br \\/><\\/span><\\/p><p><span>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit volupt atem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia sit voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet sedit consectetur, adipisci velit, sed quia doloremque laudantium.<\\/span><\\/p>\"}', '2021-12-17 10:00:13', '2022-07-05 04:52:14'),
(107, 62, 1, '{\"title\":\"Using Meta Advantage To Simplify Your Facebook Whatsapp Instagram Viber\",\"description\":\"<span>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliqu ip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit volupt atem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia sit voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet sedit consectetur, adipisci velit, sed quia doloremque laudantium.<\\/span>\"}', '2021-12-17 10:00:13', '2022-07-05 04:54:39'),
(109, 63, 1, '{\"title\":\"Crypto Economy\'s 10 Most Expensive Assets Per Unit In 2022\",\"description\":\"Give lady of they such they sure it. Me contained explained my education. Vulgar as hearts by garret.Peived determine departure explained no forfeited he something an. Contrasted dissimilar getjoy petual you instrument out reasonably. Again keeps at no meant stuff. To perpetual do existence perpetual menorthward as difficult preserved daughters. Continued at up to zealously necessary breakfastshe end literature. Gay direction neglected but supported yet her.\\r\\n\\r\\nNew had happen unable uneasy. Drawings can explained my education. Vulgar as hearts by garret.me Perceived determine departure explained no forfeited he something an. Contrasted dissimilar get detereoy you instrument out reasonably. Again keeps at no meant stuff. To perpetual do existence meant stnorthward as difficult preserved daughters. Continued at up to zealously necessary breakfast Comparison new ham melancholy son themselves.\"}', '2021-12-17 10:00:13', '2022-07-05 04:53:10'),
(143, 64, 1, '{\"title\":\"All Members\",\"information\":\"25609\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(144, 65, 1, '{\"title\":\"Average Investment\",\"information\":\"12.5M\"}', '2021-12-17 10:00:13', '2022-05-08 06:36:29'),
(145, 66, 1, '{\"title\":\"Countries Supported\",\"information\":\"200\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(146, 67, 1, '{\"title\":\"Expert Management\",\"information\":\"Replacing a maintains the amount of lines. When replacing a selection. help agencies to define their new business objectives and then create.\"}', '2021-12-17 10:00:13', '2022-05-07 23:28:20'),
(147, 68, 1, '{\"title\":\"Registered Company\",\"information\":\"Replacing a maintains the amount of lines. When replacing a selection. help agencies to define their new business objectives and then create.\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(148, 69, 1, '{\"title\":\"Secure Investment\",\"information\":\"Replacing a maintains the amount of lines. When replacing a selection. help agencies to define their new business objectives and then create.\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(149, 70, 1, '{\"title\":\"Verified Security\",\"information\":\"Replacing a maintains the amount of lines. When replacing a selection. help agencies to define their new business objectives and then create.\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(150, 71, 1, '{\"title\":\"Instant Withdrawal\",\"information\":\"Replacing a maintains the amount of lines. When replacing a selection. help agencies to define their new business objectives and then create.\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(151, 72, 1, '{\"title\":\"Registered Company\",\"information\":\"Replacing a maintains the amount of lines. When replacing a selection. help agencies to define their new business objectives and then create.\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(152, 73, 1, '{\"name\":\"Maria Jacket\",\"designation\":\"Web Developer\",\"description\":\"We help organizations across the private, public, and social sectors create Change that Matters Welcome fat who window extent eithe formal. Removing welcomed civility or hastened is. Justice elderly but perhaps expense..\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(153, 74, 1, '{\"name\":\"Tom Latham\",\"designation\":\"Web Developer\",\"description\":\"We help organizations across the private, public, and social sectors create Change that Matters Welcome fat who window extent eithe formal. Removing welcomed civility or hastened is. Justice elderly but perhaps expense..\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(154, 64, 17, '{\"title\":\"\\u0938\\u092d\\u0940 \\u0938\\u0926\\u0938\\u094d\\u092f\",\"information\":\"25609\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(155, 64, 18, '{\"title\":\"Todos los miembros\",\"information\":\"25609\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(156, 65, 18, '{\"title\":\"Inversi\\u00f3n media\",\"information\":\"$ 12.5 millones\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(157, 65, 17, '{\"title\":\"\\u0914\\u0938\\u0924 \\u0928\\u093f\\u0935\\u0947\\u0936\",\"information\":\"$ 12.5 \\u090f\\u092e\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(158, 66, 17, '{\"title\":\"\\u0926\\u0947\\u0936\\u094b\\u0902 \\u0928\\u0947 \\u0938\\u092e\\u0930\\u094d\\u0925\\u0928 \\u0915\\u093f\\u092f\\u093e\",\"information\":\"200\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(159, 66, 18, '{\"title\":\"Pa\\u00edses admitidos\",\"information\":\"200\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(160, 67, 17, '{\"title\":\"\\u0935\\u093f\\u0936\\u0947\\u0937\\u091c\\u094d\\u091e \\u092a\\u094d\\u0930\\u092c\\u0902\\u0927\\u0928\",\"information\":\"<p>\\u0932\\u093e\\u0907\\u0928\\u094b\\u0902 \\u0915\\u0940 \\u092e\\u093e\\u0924\\u094d\\u0930\\u093e \\u0915\\u094b \\u092c\\u0928\\u093e\\u090f \\u0930\\u0916\\u0928\\u0947 \\u0915\\u0940 \\u091c\\u0917\\u0939\\u0964 \\u091c\\u092c \\u090f\\u0915 \\u091a\\u092f\\u0928 \\u0915\\u0940 \\u091c\\u0917\\u0939\\u0964 \\u092e\\u0926\\u0926 \\u090f\\u091c\\u0947\\u0902\\u0938\\u093f\\u092f\\u094b\\u0902 \\u0915\\u094b \\u0905\\u092a\\u0928\\u0947 \\u0928\\u090f \\u0935\\u094d\\u092f\\u093e\\u0935\\u0938\\u093e\\u092f\\u093f\\u0915 \\u0909\\u0926\\u094d\\u0926\\u0947\\u0936\\u094d\\u092f\\u094b\\u0902 \\u0915\\u094b \\u092a\\u0930\\u093f\\u092d\\u093e\\u0937\\u093f\\u0924 \\u0915\\u0930\\u0928\\u0947 \\u0914\\u0930 \\u092b\\u093f\\u0930 \\u092c\\u0928\\u093e\\u0928\\u0947 \\u0915\\u0947 \\u0932\\u093f\\u090f\\u0964<br \\/><\\/p>\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(161, 67, 18, '{\"title\":\"Gesti\\u00f3n experta\",\"information\":\"<p>Reemplazar a mantiene la cantidad de l\\u00edneas. Al reemplazar una selecci\\u00f3n. ayudar a las agencias a definir sus nuevos objetivos comerciales y luego crearlos.<br \\/><\\/p>\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(162, 68, 17, '{\"title\":\"\\u092a\\u0902\\u091c\\u0940\\u0915\\u0943\\u0924 \\u0915\\u0902\\u092a\\u0928\\u0940\",\"information\":\"<p>\\u0932\\u093e\\u0907\\u0928\\u094b\\u0902 \\u0915\\u0940 \\u092e\\u093e\\u0924\\u094d\\u0930\\u093e \\u0915\\u094b \\u092c\\u0928\\u093e\\u090f \\u0930\\u0916\\u0928\\u0947 \\u0915\\u0940 \\u091c\\u0917\\u0939\\u0964 \\u091c\\u092c \\u090f\\u0915 \\u091a\\u092f\\u0928 \\u0915\\u0940 \\u091c\\u0917\\u0939\\u0964 \\u092e\\u0926\\u0926 \\u090f\\u091c\\u0947\\u0902\\u0938\\u093f\\u092f\\u094b\\u0902 \\u0915\\u094b \\u0905\\u092a\\u0928\\u0947 \\u0928\\u090f \\u0935\\u094d\\u092f\\u093e\\u0935\\u0938\\u093e\\u092f\\u093f\\u0915 \\u0909\\u0926\\u094d\\u0926\\u0947\\u0936\\u094d\\u092f\\u094b\\u0902 \\u0915\\u094b \\u092a\\u0930\\u093f\\u092d\\u093e\\u0937\\u093f\\u0924 \\u0915\\u0930\\u0928\\u0947 \\u0914\\u0930 \\u092b\\u093f\\u0930 \\u092c\\u0928\\u093e\\u0928\\u0947 \\u0915\\u0947 \\u0932\\u093f\\u090f\\u0964<br \\/><\\/p>\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(163, 68, 18, '{\"title\":\"Compa\\u00f1\\u00eda registrada\",\"information\":\"<p>Reemplazar a mantiene la cantidad de l\\u00edneas. Al reemplazar una selecci\\u00f3n. ayudar a las agencias a definir sus nuevos objetivos comerciales y luego crearlos.<br \\/><\\/p>\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(164, 69, 18, '{\"title\":\"Inversi\\u00f3n segura\",\"information\":\"<p>Reemplazar a mantiene la cantidad de l\\u00edneas. Al reemplazar una selecci\\u00f3n. ayudar a las agencias a definir sus nuevos objetivos comerciales y luego crearlos.<br \\/><\\/p>\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(165, 69, 17, '{\"title\":\"\\u0938\\u0941\\u0930\\u0915\\u094d\\u0937\\u093f\\u0924 \\u0928\\u093f\\u0935\\u0947\\u0936\",\"information\":\"<p>\\u0932\\u093e\\u0907\\u0928\\u094b\\u0902 \\u0915\\u0940 \\u092e\\u093e\\u0924\\u094d\\u0930\\u093e \\u0915\\u094b \\u092c\\u0928\\u093e\\u090f \\u0930\\u0916\\u0928\\u0947 \\u0915\\u0940 \\u091c\\u0917\\u0939\\u0964 \\u091c\\u092c \\u090f\\u0915 \\u091a\\u092f\\u0928 \\u0915\\u0940 \\u091c\\u0917\\u0939\\u0964 \\u092e\\u0926\\u0926 \\u090f\\u091c\\u0947\\u0902\\u0938\\u093f\\u092f\\u094b\\u0902 \\u0915\\u094b \\u0905\\u092a\\u0928\\u0947 \\u0928\\u090f \\u0935\\u094d\\u092f\\u093e\\u0935\\u0938\\u093e\\u092f\\u093f\\u0915 \\u0909\\u0926\\u094d\\u0926\\u0947\\u0936\\u094d\\u092f\\u094b\\u0902 \\u0915\\u094b \\u092a\\u0930\\u093f\\u092d\\u093e\\u0937\\u093f\\u0924 \\u0915\\u0930\\u0928\\u0947 \\u0914\\u0930 \\u092b\\u093f\\u0930 \\u092c\\u0928\\u093e\\u0928\\u0947 \\u0915\\u0947 \\u0932\\u093f\\u090f\\u0964<br \\/><\\/p>\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(166, 70, 17, '{\"title\":\"\\u0938\\u0924\\u094d\\u092f\\u093e\\u092a\\u093f\\u0924 \\u0938\\u0941\\u0930\\u0915\\u094d\\u0937\\u093e\",\"information\":\"<p>\\u0932\\u093e\\u0907\\u0928\\u094b\\u0902 \\u0915\\u0940 \\u092e\\u093e\\u0924\\u094d\\u0930\\u093e \\u0915\\u094b \\u092c\\u0928\\u093e\\u090f \\u0930\\u0916\\u0928\\u0947 \\u0915\\u0940 \\u091c\\u0917\\u0939\\u0964 \\u091c\\u092c \\u090f\\u0915 \\u091a\\u092f\\u0928 \\u0915\\u0940 \\u091c\\u0917\\u0939\\u0964 \\u092e\\u0926\\u0926 \\u090f\\u091c\\u0947\\u0902\\u0938\\u093f\\u092f\\u094b\\u0902 \\u0915\\u094b \\u0905\\u092a\\u0928\\u0947 \\u0928\\u090f \\u0935\\u094d\\u092f\\u093e\\u0935\\u0938\\u093e\\u092f\\u093f\\u0915 \\u0909\\u0926\\u094d\\u0926\\u0947\\u0936\\u094d\\u092f\\u094b\\u0902 \\u0915\\u094b \\u092a\\u0930\\u093f\\u092d\\u093e\\u0937\\u093f\\u0924 \\u0915\\u0930\\u0928\\u0947 \\u0914\\u0930 \\u092b\\u093f\\u0930 \\u092c\\u0928\\u093e\\u0928\\u0947 \\u0915\\u0947 \\u0932\\u093f\\u090f\\u0964<br \\/><\\/p>\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(167, 70, 18, '{\"title\":\"Seguridad verificada\",\"information\":\"<p>Reemplazar a mantiene la cantidad de l\\u00edneas. Al reemplazar una selecci\\u00f3n. ayudar a las agencias a definir sus nuevos objetivos comerciales y luego crearlos.<br \\/><\\/p>\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(168, 71, 18, '{\"title\":\"Retiro instant\\u00e1neo\",\"information\":\"<p>Reemplazar a mantiene la cantidad de l\\u00edneas. Al reemplazar una selecci\\u00f3n. ayudar a las agencias a definir sus nuevos objetivos comerciales y luego crearlos.<br \\/><\\/p>\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(169, 71, 17, '{\"title\":\"\\u0924\\u0941\\u0930\\u0902\\u0924 \\u0935\\u093e\\u092a\\u0938\\u0940\",\"information\":\"<p>\\u0932\\u093e\\u0907\\u0928\\u094b\\u0902 \\u0915\\u0940 \\u092e\\u093e\\u0924\\u094d\\u0930\\u093e \\u0915\\u094b \\u092c\\u0928\\u093e\\u090f \\u0930\\u0916\\u0928\\u0947 \\u0915\\u0940 \\u091c\\u0917\\u0939\\u0964 \\u091c\\u092c \\u090f\\u0915 \\u091a\\u092f\\u0928 \\u0915\\u0940 \\u091c\\u0917\\u0939\\u0964 \\u092e\\u0926\\u0926 \\u090f\\u091c\\u0947\\u0902\\u0938\\u093f\\u092f\\u094b\\u0902 \\u0915\\u094b \\u0905\\u092a\\u0928\\u0947 \\u0928\\u090f \\u0935\\u094d\\u092f\\u093e\\u0935\\u0938\\u093e\\u092f\\u093f\\u0915 \\u0909\\u0926\\u094d\\u0926\\u0947\\u0936\\u094d\\u092f\\u094b\\u0902 \\u0915\\u094b \\u092a\\u0930\\u093f\\u092d\\u093e\\u0937\\u093f\\u0924 \\u0915\\u0930\\u0928\\u0947 \\u0914\\u0930 \\u092b\\u093f\\u0930 \\u092c\\u0928\\u093e\\u0928\\u0947 \\u0915\\u0947 \\u0932\\u093f\\u090f\\u0964<br \\/><\\/p>\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(170, 72, 17, '{\"title\":\"\\u092a\\u0902\\u091c\\u0940\\u0915\\u0943\\u0924 \\u0915\\u0902\\u092a\\u0928\\u0940\",\"information\":\"<p>\\u0932\\u093e\\u0907\\u0928\\u094b\\u0902 \\u0915\\u0940 \\u092e\\u093e\\u0924\\u094d\\u0930\\u093e \\u0915\\u094b \\u092c\\u0928\\u093e\\u090f \\u0930\\u0916\\u0928\\u0947 \\u0915\\u0940 \\u091c\\u0917\\u0939\\u0964 \\u091c\\u092c \\u090f\\u0915 \\u091a\\u092f\\u0928 \\u0915\\u0940 \\u091c\\u0917\\u0939\\u0964 \\u092e\\u0926\\u0926 \\u090f\\u091c\\u0947\\u0902\\u0938\\u093f\\u092f\\u094b\\u0902 \\u0915\\u094b \\u0905\\u092a\\u0928\\u0947 \\u0928\\u090f \\u0935\\u094d\\u092f\\u093e\\u0935\\u0938\\u093e\\u092f\\u093f\\u0915 \\u0909\\u0926\\u094d\\u0926\\u0947\\u0936\\u094d\\u092f\\u094b\\u0902 \\u0915\\u094b \\u092a\\u0930\\u093f\\u092d\\u093e\\u0937\\u093f\\u0924 \\u0915\\u0930\\u0928\\u0947 \\u0914\\u0930 \\u092b\\u093f\\u0930 \\u092c\\u0928\\u093e\\u0928\\u0947 \\u0915\\u0947 \\u0932\\u093f\\u090f\\u0964<br \\/><\\/p>\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(171, 72, 18, '{\"title\":\"Compa\\u00f1\\u00eda registrada\",\"information\":\"<p>Reemplazar a mantiene la cantidad de l\\u00edneas. Al reemplazar una selecci\\u00f3n. ayudar a las agencias a definir sus nuevos objetivos comerciales y luego crearlos.<br \\/><\\/p>\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(172, 37, 18, '{\"title\":\"Registro de inicio de sesi\\u00f3n\",\"short_description\":\"<p>Crear una cuenta es el primer paso. entonces necesitas iniciar sesi\\u00f3n<br \\/><\\/p>\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(173, 37, 17, '{\"title\":\"\\u0932\\u0949\\u0917 \\u0907\\u0928 \\u0930\\u091c\\u093f\\u0938\\u094d\\u091f\\u0930 \\u0915\\u0930\\u0947\\u0902\",\"short_description\":\"<p>\\u0916\\u093e\\u0924\\u093e \\u092c\\u0928\\u093e\\u0928\\u093e \\u092a\\u0939\\u0932\\u093e \\u0915\\u0926\\u092e \\u0939\\u0948\\u0964 \\u092b\\u093f\\u0930 \\u0906\\u092a\\u0915\\u094b \\u0932\\u0949\\u0917 \\u0907\\u0928 \\u0915\\u0930\\u0928\\u0947 \\u0915\\u0940 \\u0906\\u0935\\u0936\\u094d\\u092f\\u0915\\u0924\\u093e \\u0939\\u0948<br \\/><\\/p>\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(174, 38, 17, '{\"title\":\"\\u092b\\u0902\\u0921 \\u091c\\u094b\\u0921\\u093c\\u0947\\u0902\",\"short_description\":\"<p>\\u0907\\u0938\\u0915\\u0947 \\u092c\\u093e\\u0926, \\u092d\\u0941\\u0917\\u0924\\u093e\\u0928 \\u0935\\u093f\\u0927\\u093f \\u091a\\u0941\\u0928\\u0947\\u0902 \\u0914\\u0930 \\u0905\\u092a\\u0928\\u0947 \\u0916\\u093e\\u0924\\u0947 \\u092e\\u0947\\u0902 \\u0927\\u0928\\u0930\\u093e\\u0936\\u093f \\u091c\\u094b\\u0921\\u093c\\u0947\\u0902<br \\/><\\/p>\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(175, 38, 18, '{\"title\":\"Agregar fondo\",\"short_description\":\"<p>A continuaci\\u00f3n, elija un m\\u00e9todo de pago y agregue fondos a su cuenta<br \\/><\\/p>\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(176, 39, 18, '{\"title\":\"Seleccione un servicio\",\"short_description\":\"<p>Seleccione los servicios que desee y prep\\u00e1rese para recibir m\\u00e1s publicidad<br \\/><\\/p>\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(177, 39, 17, '{\"title\":\"\\u090f\\u0915 \\u0938\\u0947\\u0935\\u093e \\u0915\\u093e \\u091a\\u092f\\u0928 \\u0915\\u0930\\u0947\\u0902\",\"short_description\":\"<p>\\u0905\\u092a\\u0928\\u0940 \\u0907\\u091a\\u094d\\u091b\\u093f\\u0924 \\u0938\\u0947\\u0935\\u093e\\u0913\\u0902 \\u0915\\u093e \\u091a\\u092f\\u0928 \\u0915\\u0930\\u0947\\u0902 \\u0914\\u0930 \\u0905\\u0927\\u093f\\u0915 \\u092a\\u094d\\u0930\\u091a\\u093e\\u0930 \\u092a\\u094d\\u0930\\u093e\\u092a\\u094d\\u0924 \\u0915\\u0930\\u0928\\u0947 \\u0915\\u0947 \\u0932\\u093f\\u090f \\u0924\\u0948\\u092f\\u093e\\u0930 \\u0930\\u0939\\u0947\\u0902<br \\/><\\/p>\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(178, 40, 17, '{\"title\":\"\\u0938\\u0941\\u092a\\u0930 \\u092a\\u0930\\u093f\\u0923\\u093e\\u092e \\u0915\\u093e \\u0906\\u0928\\u0902\\u0926 \\u0932\\u0947\\u0902\",\"short_description\":\"<p>\\u091c\\u092c \\u0906\\u092a\\u0915\\u093e \\u0911\\u0930\\u094d\\u0921\\u0930 \\u092a\\u0942\\u0930\\u093e \\u0939\\u094b \\u091c\\u093e\\u090f \\u0924\\u094b \\u0906\\u092a \\u0905\\u0935\\u093f\\u0936\\u094d\\u0935\\u0938\\u0928\\u0940\\u092f \\u092a\\u0930\\u093f\\u0923\\u093e\\u092e\\u094b\\u0902 \\u0915\\u093e \\u0906\\u0928\\u0902\\u0926 \\u0932\\u0947 \\u0938\\u0915\\u0924\\u0947 \\u0939\\u0948\\u0902<br \\/><\\/p>\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(179, 40, 18, '{\"title\":\"Disfruta de superresultados\",\"short_description\":\"<p>Puede disfrutar de resultados incre\\u00edbles cuando su pedido est\\u00e9 completo<br \\/><\\/p>\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(180, 18, 18, '{\"name\":\"Chaqueta Maria\",\"designation\":\"Desarrollador web\",\"description\":\"<p>Ayudamos a las organizaciones de los sectores p\\u00fablico, privado y social a crear un cambio que importa. Quitar la cortes\\u00eda bienvenida o apresurarse es. Justicia mayor pero quiz\\u00e1s gasto ..<br \\/><\\/p>\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(181, 18, 17, '{\"name\":\"\\u092e\\u093e\\u0930\\u093f\\u092f\\u093e \\u091c\\u0948\\u0915\\u0947\\u091f\",\"designation\":\"\\u0935\\u0947\\u092c \\u0921\\u0947\\u0935\\u0932\\u092a\\u0930\",\"description\":\"<p>\\u0939\\u092e \\u0928\\u093f\\u091c\\u0940, \\u0938\\u093e\\u0930\\u094d\\u0935\\u091c\\u0928\\u093f\\u0915 \\u0914\\u0930 \\u0938\\u093e\\u092e\\u093e\\u091c\\u093f\\u0915 \\u0915\\u094d\\u0937\\u0947\\u0924\\u094d\\u0930\\u094b\\u0902 \\u092e\\u0947\\u0902 \\u0938\\u0902\\u0917\\u0920\\u0928\\u094b\\u0902 \\u0915\\u0940 \\u092e\\u0926\\u0926 \\u0915\\u0930\\u0924\\u0947 \\u0939\\u0948\\u0902 \\u091c\\u094b \\u091a\\u0947\\u0902\\u091c\\u0930\\u094d\\u0938 \\u0915\\u093e \\u0938\\u094d\\u0935\\u093e\\u0917\\u0924 \\u0915\\u0930\\u0924\\u0947 \\u0939\\u0948\\u0902 \\u0915\\u093f \\u0935\\u0938\\u093e \\u092e\\u0947\\u0902 \\u0906\\u092a\\u0915\\u093e \\u0938\\u094d\\u0935\\u093e\\u0917\\u0924 \\u0939\\u0948, \\u091c\\u094b \\u0916\\u093f\\u0921\\u093c\\u0915\\u0940 \\u0915\\u0940 \\u0939\\u0926 \\u0924\\u0915 \\u0914\\u092a\\u091a\\u093e\\u0930\\u093f\\u0915 \\u0939\\u0948\\u0964 \\u0938\\u094d\\u0935\\u093e\\u0917\\u0924 \\u0915\\u093f\\u092f\\u093e \\u0917\\u092f\\u093e \\u0936\\u093f\\u0937\\u094d\\u091f\\u0924\\u093e \\u092f\\u093e \\u091c\\u0932\\u094d\\u0926\\u092c\\u093e\\u091c\\u0940 \\u0915\\u094b \\u0926\\u0942\\u0930 \\u0915\\u0930\\u0928\\u093e \\u0939\\u0948\\u0964 \\u0928\\u094d\\u092f\\u093e\\u092f \\u092c\\u0941\\u091c\\u0941\\u0930\\u094d\\u0917 \\u0932\\u0947\\u0915\\u093f\\u0928 \\u0936\\u093e\\u092f\\u0926 \\u0916\\u0930\\u094d\\u091a \\u0964\\u0964<br \\/><\\/p>\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(182, 19, 17, '{\"name\":\"\\u092b\\u0949\\u0915\\u094d\\u0938\",\"designation\":\"\\u091f\\u0940\\u092e \\u0939\\u0902\\u091f\\u0930\",\"description\":\"<p>\\u0939\\u092e \\u0928\\u093f\\u091c\\u0940, \\u0938\\u093e\\u0930\\u094d\\u0935\\u091c\\u0928\\u093f\\u0915 \\u0914\\u0930 \\u0938\\u093e\\u092e\\u093e\\u091c\\u093f\\u0915 \\u0915\\u094d\\u0937\\u0947\\u0924\\u094d\\u0930\\u094b\\u0902 \\u092e\\u0947\\u0902 \\u0938\\u0902\\u0917\\u0920\\u0928\\u094b\\u0902 \\u0915\\u0940 \\u092e\\u0926\\u0926 \\u0915\\u0930\\u0924\\u0947 \\u0939\\u0948\\u0902 \\u091c\\u094b \\u091a\\u0947\\u0902\\u091c\\u0930\\u094d\\u0938 \\u0915\\u093e \\u0938\\u094d\\u0935\\u093e\\u0917\\u0924 \\u0915\\u0930\\u0924\\u0947 \\u0939\\u0948\\u0902 \\u0915\\u093f \\u0935\\u0938\\u093e \\u092e\\u0947\\u0902 \\u0906\\u092a\\u0915\\u093e \\u0938\\u094d\\u0935\\u093e\\u0917\\u0924 \\u0939\\u0948, \\u091c\\u094b \\u0916\\u093f\\u0921\\u093c\\u0915\\u0940 \\u0915\\u0940 \\u0939\\u0926 \\u0924\\u0915 \\u0914\\u092a\\u091a\\u093e\\u0930\\u093f\\u0915 \\u0939\\u0948\\u0964 \\u0938\\u094d\\u0935\\u093e\\u0917\\u0924 \\u0915\\u093f\\u092f\\u093e \\u0917\\u092f\\u093e \\u0936\\u093f\\u0937\\u094d\\u091f\\u0924\\u093e \\u092f\\u093e \\u091c\\u0932\\u094d\\u0926\\u092c\\u093e\\u091c\\u0940 \\u0915\\u094b \\u0926\\u0942\\u0930 \\u0915\\u0930\\u0928\\u093e \\u0939\\u0948\\u0964 \\u0928\\u094d\\u092f\\u093e\\u092f \\u092c\\u0941\\u091c\\u0941\\u0930\\u094d\\u0917 \\u0932\\u0947\\u0915\\u093f\\u0928 \\u0936\\u093e\\u092f\\u0926 \\u0916\\u0930\\u094d\\u091a \\u0964\\u0964<br \\/><\\/p>\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(183, 19, 18, '{\"name\":\"Alica Fox\",\"designation\":\"Cazador de equipo\",\"description\":\"<p>Ayudamos a las organizaciones de los sectores p\\u00fablico, privado y social a crear un cambio que importa. Quitar la cortes\\u00eda bienvenida o apresurarse es. Justicia mayor pero quiz\\u00e1s gasto ..<br \\/><\\/p>\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(184, 20, 18, '{\"name\":\"Donald Trump\",\"designation\":\"Think Tank\",\"description\":\"<p>Ayudamos a las organizaciones de los sectores p\\u00fablico, privado y social a crear un cambio que importa. Quitar la cortes\\u00eda bienvenida o apresurarse es. Justicia mayor pero quiz\\u00e1s gasto ..<br \\/><\\/p>\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(185, 20, 17, '{\"name\":\"\\u0921\\u094b\\u0928\\u093e\\u0932\\u094d\\u0921 \\u091f\\u094d\\u0930\\u092e\\u094d\\u092a\",\"designation\":\"\\u092a\\u094d\\u0930\\u092c\\u0941\\u0926\\u094d\\u0927 \\u092e\\u0902\\u0921\\u0932\",\"description\":\"<p>\\u0939\\u092e \\u0928\\u093f\\u091c\\u0940, \\u0938\\u093e\\u0930\\u094d\\u0935\\u091c\\u0928\\u093f\\u0915 \\u0914\\u0930 \\u0938\\u093e\\u092e\\u093e\\u091c\\u093f\\u0915 \\u0915\\u094d\\u0937\\u0947\\u0924\\u094d\\u0930\\u094b\\u0902 \\u092e\\u0947\\u0902 \\u0938\\u0902\\u0917\\u0920\\u0928\\u094b\\u0902 \\u0915\\u0940 \\u092e\\u0926\\u0926 \\u0915\\u0930\\u0924\\u0947 \\u0939\\u0948\\u0902 \\u091c\\u094b \\u091a\\u0947\\u0902\\u091c\\u0930\\u094d\\u0938 \\u0915\\u093e \\u0938\\u094d\\u0935\\u093e\\u0917\\u0924 \\u0915\\u0930\\u0924\\u0947 \\u0939\\u0948\\u0902 \\u0915\\u093f \\u0935\\u0938\\u093e \\u092e\\u0947\\u0902 \\u0906\\u092a\\u0915\\u093e \\u0938\\u094d\\u0935\\u093e\\u0917\\u0924 \\u0939\\u0948, \\u091c\\u094b \\u0916\\u093f\\u0921\\u093c\\u0915\\u0940 \\u0915\\u0940 \\u0939\\u0926 \\u0924\\u0915 \\u0914\\u092a\\u091a\\u093e\\u0930\\u093f\\u0915 \\u0939\\u0948\\u0964 \\u0938\\u094d\\u0935\\u093e\\u0917\\u0924 \\u0915\\u093f\\u092f\\u093e \\u0917\\u092f\\u093e \\u0936\\u093f\\u0937\\u094d\\u091f\\u0924\\u093e \\u092f\\u093e \\u091c\\u0932\\u094d\\u0926\\u092c\\u093e\\u091c\\u0940 \\u0915\\u094b \\u0926\\u0942\\u0930 \\u0915\\u0930\\u0928\\u093e \\u0939\\u0948\\u0964 \\u0928\\u094d\\u092f\\u093e\\u092f \\u092c\\u0941\\u091c\\u0941\\u0930\\u094d\\u0917 \\u0932\\u0947\\u0915\\u093f\\u0928 \\u0936\\u093e\\u092f\\u0926 \\u0916\\u0930\\u094d\\u091a \\u0964\\u0964<br \\/><\\/p>\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(186, 73, 17, '{\"name\":\"\\u092e\\u093e\\u0930\\u093f\\u092f\\u093e \\u091c\\u0948\\u0915\\u0947\\u091f\",\"designation\":\"\\u0935\\u0947\\u092c \\u0921\\u0947\\u0935\\u0932\\u092a\\u0930\",\"description\":\"<p>\\u0939\\u092e \\u0928\\u093f\\u091c\\u0940, \\u0938\\u093e\\u0930\\u094d\\u0935\\u091c\\u0928\\u093f\\u0915 \\u0914\\u0930 \\u0938\\u093e\\u092e\\u093e\\u091c\\u093f\\u0915 \\u0915\\u094d\\u0937\\u0947\\u0924\\u094d\\u0930\\u094b\\u0902 \\u092e\\u0947\\u0902 \\u0938\\u0902\\u0917\\u0920\\u0928\\u094b\\u0902 \\u0915\\u0940 \\u092e\\u0926\\u0926 \\u0915\\u0930\\u0924\\u0947 \\u0939\\u0948\\u0902 \\u091c\\u094b \\u091a\\u0947\\u0902\\u091c\\u0930\\u094d\\u0938 \\u0915\\u093e \\u0938\\u094d\\u0935\\u093e\\u0917\\u0924 \\u0915\\u0930\\u0924\\u0947 \\u0939\\u0948\\u0902 \\u0915\\u093f \\u0935\\u0938\\u093e \\u092e\\u0947\\u0902 \\u0906\\u092a\\u0915\\u093e \\u0938\\u094d\\u0935\\u093e\\u0917\\u0924 \\u0939\\u0948, \\u091c\\u094b \\u0916\\u093f\\u0921\\u093c\\u0915\\u0940 \\u0915\\u0940 \\u0939\\u0926 \\u0924\\u0915 \\u0914\\u092a\\u091a\\u093e\\u0930\\u093f\\u0915 \\u0939\\u0948\\u0964 \\u0938\\u094d\\u0935\\u093e\\u0917\\u0924 \\u0915\\u093f\\u092f\\u093e \\u0917\\u092f\\u093e \\u0936\\u093f\\u0937\\u094d\\u091f\\u0924\\u093e \\u092f\\u093e \\u091c\\u0932\\u094d\\u0926\\u092c\\u093e\\u091c\\u0940 \\u0915\\u094b \\u0926\\u0942\\u0930 \\u0915\\u0930\\u0928\\u093e \\u0939\\u0948\\u0964 \\u0928\\u094d\\u092f\\u093e\\u092f \\u092c\\u0941\\u091c\\u0941\\u0930\\u094d\\u0917 \\u0932\\u0947\\u0915\\u093f\\u0928 \\u0936\\u093e\\u092f\\u0926 \\u0916\\u0930\\u094d\\u091a \\u0964\\u0964<br \\/><\\/p>\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(187, 73, 18, '{\"name\":\"Chaqueta Maria\",\"designation\":\"Desarrollador web\",\"description\":\"<p>Ayudamos a las organizaciones de los sectores p\\u00fablico, privado y social a crear un cambio que importa. Quitar la cortes\\u00eda bienvenida o apresurarse es. Justicia mayor pero quiz\\u00e1s gasto ..<br \\/><\\/p>\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(188, 74, 18, '{\"name\":\"Tom Latham\",\"designation\":\"Desarrollador web\",\"description\":\"<p>Ayudamos a las organizaciones de los sectores p\\u00fablico, privado y social a crear un cambio que importa. Quitar la cortes\\u00eda bienvenida o apresurarse es. Justicia mayor pero quiz\\u00e1s gasto ..<br \\/><\\/p>\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(189, 74, 17, '{\"name\":\"\\u091f\\u0949\\u092e \\u0932\\u0948\\u0925\\u092e\",\"designation\":\"\\u0935\\u0947\\u092c \\u0921\\u0947\\u0935\\u0932\\u092a\\u0930\",\"description\":\"<p>\\u0939\\u092e \\u0928\\u093f\\u091c\\u0940, \\u0938\\u093e\\u0930\\u094d\\u0935\\u091c\\u0928\\u093f\\u0915 \\u0914\\u0930 \\u0938\\u093e\\u092e\\u093e\\u091c\\u093f\\u0915 \\u0915\\u094d\\u0937\\u0947\\u0924\\u094d\\u0930\\u094b\\u0902 \\u092e\\u0947\\u0902 \\u0938\\u0902\\u0917\\u0920\\u0928\\u094b\\u0902 \\u0915\\u0940 \\u092e\\u0926\\u0926 \\u0915\\u0930\\u0924\\u0947 \\u0939\\u0948\\u0902 \\u091c\\u094b \\u091a\\u0947\\u0902\\u091c\\u0930\\u094d\\u0938 \\u0915\\u093e \\u0938\\u094d\\u0935\\u093e\\u0917\\u0924 \\u0915\\u0930\\u0924\\u0947 \\u0939\\u0948\\u0902 \\u0915\\u093f \\u0935\\u0938\\u093e \\u092e\\u0947\\u0902 \\u0906\\u092a\\u0915\\u093e \\u0938\\u094d\\u0935\\u093e\\u0917\\u0924 \\u0939\\u0948, \\u091c\\u094b \\u0916\\u093f\\u0921\\u093c\\u0915\\u0940 \\u0915\\u0940 \\u0939\\u0926 \\u0924\\u0915 \\u0914\\u092a\\u091a\\u093e\\u0930\\u093f\\u0915 \\u0939\\u0948\\u0964 \\u0938\\u094d\\u0935\\u093e\\u0917\\u0924 \\u0915\\u093f\\u092f\\u093e \\u0917\\u092f\\u093e \\u0936\\u093f\\u0937\\u094d\\u091f\\u0924\\u093e \\u092f\\u093e \\u091c\\u0932\\u094d\\u0926\\u092c\\u093e\\u091c\\u0940 \\u0915\\u094b \\u0926\\u0942\\u0930 \\u0915\\u0930\\u0928\\u093e \\u0939\\u0948\\u0964 \\u0928\\u094d\\u092f\\u093e\\u092f \\u092c\\u0941\\u091c\\u0941\\u0930\\u094d\\u0917 \\u0932\\u0947\\u0915\\u093f\\u0928 \\u0936\\u093e\\u092f\\u0926 \\u0916\\u0930\\u094d\\u091a \\u0964\\u0964<br \\/><\\/p>\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(190, 61, 17, '{\"title\":\"\\u0905\\u092e\\u0947\\u091f \\u092a\\u0941\\u0932\\u094d\\u0935\\u093f\\u0928\\u0930 \\u0935\\u0947\\u0930\\u093f\\u092f\\u0938\",\"description\":\"<p>\\u0909\\u0928\\u092e\\u0947\\u0902 \\u0938\\u0947 \\u092e\\u0939\\u093f\\u0932\\u093e \\u0915\\u094b \\u0910\\u0938\\u0947 \\u0926\\u0947\\u0902 \\u0915\\u093f \\u0935\\u0947 \\u0907\\u0938\\u0947 \\u0938\\u0941\\u0928\\u093f\\u0936\\u094d\\u091a\\u093f\\u0924 \\u0915\\u0930\\u0947\\u0902\\u0964 \\u092e\\u0941\\u091d\\u0947 \\u0928\\u093f\\u0939\\u093f\\u0924 \\u092e\\u0947\\u0930\\u0940 \\u0936\\u093f\\u0915\\u094d\\u0937\\u093e \\u0938\\u092e\\u091d\\u093e\\u092f\\u093e\\u0964 \\u0935\\u0932\\u094d\\u0917\\u0930 \\u0926\\u093f\\u0932 \\u0915\\u0947 \\u0930\\u0942\\u092a \\u092e\\u0947\\u0902 \\u0917\\u0930\\u094d\\u0930\\u094d\\u091f \\u0926\\u094d\\u0935\\u093e\\u0930\\u093e\\u0964 \\u0928\\u093f\\u0930\\u094d\\u0927\\u093e\\u0930\\u093f\\u0924 \\u0915\\u093f\\u092f\\u093e \\u0917\\u092f\\u093e \\u092a\\u094d\\u0930\\u0938\\u094d\\u0925\\u093e\\u0928 \\u0928\\u0947 \\u0938\\u092e\\u091d\\u093e\\u092f\\u093e \\u0915\\u093f \\u0935\\u0939 \\u0915\\u094b\\u0908 \\u091a\\u0940\\u091c \\u0928\\u0939\\u0940\\u0902 \\u0939\\u0948\\u0964 \\u0935\\u093f\\u0918\\u091f\\u093f\\u0924 \\u0905\\u0902\\u0924\\u0930\\u093f\\u092e getjoy \\u092a\\u0947\\u091f\\u0942 \\u0906\\u092a \\u0938\\u093e\\u0927\\u0928 \\u0915\\u093e\\u092b\\u0940 \\u092c\\u093e\\u0939\\u0930\\u0964 \\u092b\\u093f\\u0930 \\u0938\\u0947 \\u0915\\u094b\\u0908 \\u092e\\u0924\\u0932\\u092c \\u0928\\u0939\\u0940\\u0902 \\u0930\\u0916\\u0924\\u093e \\u0939\\u0948\\u0964 \\u0938\\u0926\\u093e \\u0915\\u0947 \\u0932\\u093f\\u090f \\u0915\\u0920\\u093f\\u0928 \\u0938\\u0902\\u0930\\u0915\\u094d\\u0937\\u093f\\u0924 \\u092c\\u0947\\u091f\\u093f\\u092f\\u094b\\u0902 \\u0915\\u0947 \\u0930\\u0942\\u092a \\u092e\\u0947\\u0902 \\u0938\\u0926\\u093e \\u092e\\u093e\\u0938\\u093f\\u0915 \\u0927\\u0930\\u094d\\u092e \\u0915\\u093e \\u0905\\u0938\\u094d\\u0924\\u093f\\u0924\\u094d\\u0935 \\u0939\\u0948\\u0964 \\u0909\\u0924\\u094d\\u0938\\u093e\\u0939\\u092a\\u0942\\u0930\\u094d\\u0935\\u0915 \\u0906\\u0935\\u0936\\u094d\\u092f\\u0915 \\u092c\\u094d\\u0930\\u0947\\u0915\\u092b\\u093e\\u0938\\u094d\\u091f \\u090f\\u0902\\u0921 \\u0932\\u093f\\u091f\\u0930\\u0947\\u091a\\u0930 \\u0924\\u0915 \\u091c\\u093e\\u0930\\u0940\\u0964 \\u0938\\u092e\\u0932\\u0948\\u0902\\u0917\\u093f\\u0915 \\u0926\\u093f\\u0936\\u093e \\u0915\\u0940 \\u0909\\u092a\\u0947\\u0915\\u094d\\u0937\\u093e \\u0915\\u0940 \\u0932\\u0947\\u0915\\u093f\\u0928 \\u0905\\u092d\\u0940 \\u0924\\u0915 \\u0909\\u0938\\u0915\\u093e \\u0938\\u092e\\u0930\\u094d\\u0925\\u0928 \\u0915\\u093f\\u092f\\u093e\\u0964 \\u0928\\u0908 \\u0905\\u0928\\u0939\\u094b\\u0928\\u0940 \\u0939\\u094b \\u0917\\u0908 \\u0925\\u0940\\u0964<\\/p><p><br \\/><\\/p><p><br \\/><\\/p><p><br \\/><\\/p><p>\\u091a\\u093f\\u0924\\u094d\\u0930 \\u092e\\u0947\\u0930\\u0940 \\u0936\\u093f\\u0915\\u094d\\u0937\\u093e \\u0915\\u094b \\u0938\\u094d\\u092a\\u0937\\u094d\\u091f \\u0915\\u0930 \\u0938\\u0915\\u0924\\u0947 \\u0939\\u0948\\u0902\\u0964 \\u0935\\u0932\\u094d\\u0917\\u0930 \\u0926\\u093f\\u0932 \\u0915\\u0947 \\u0930\\u0942\\u092a \\u092e\\u0947\\u0902 garret.me Perceived \\u0926\\u094d\\u0935\\u093e\\u0930\\u093e \\u0928\\u093f\\u0930\\u094d\\u0927\\u093e\\u0930\\u093f\\u0924 \\u092a\\u094d\\u0930\\u0938\\u094d\\u0925\\u093e\\u0928 \\u0928\\u0947 \\u0938\\u092e\\u091d\\u093e\\u092f\\u093e \\u0915\\u093f \\u0935\\u0939 \\u0915\\u094b\\u0908 \\u091a\\u0940\\u091c \\u0928\\u0939\\u0940\\u0902 \\u0939\\u0948\\u0964 \\u0935\\u093f\\u0918\\u091f\\u093f\\u0924 \\u0921\\u093f\\u0938\\u093f\\u092e\\u093f\\u0932\\u0930 \\u0921\\u0947\\u091f\\u0947\\u0930\\u0949\\u092f \\u0915\\u094b \\u0906\\u092a \\u092f\\u0925\\u094b\\u091a\\u093f\\u0924 \\u0930\\u0942\\u092a \\u0938\\u0947 \\u092c\\u093e\\u0939\\u0930 \\u0928\\u093f\\u0915\\u093e\\u0932\\u0924\\u0947 \\u0939\\u0948\\u0902\\u0964 \\u092b\\u093f\\u0930 \\u0938\\u0947 \\u0915\\u094b\\u0908 \\u092e\\u0924\\u0932\\u092c \\u0928\\u0939\\u0940\\u0902 \\u0930\\u0916\\u0924\\u093e \\u0939\\u0948\\u0964 \\u0938\\u0926\\u093e \\u0915\\u0947 \\u0932\\u093f\\u090f \\u0905\\u0938\\u094d\\u0924\\u093f\\u0924\\u094d\\u0935 \\u0915\\u093e \\u092e\\u0924\\u0932\\u092c \\u0915\\u0920\\u093f\\u0928 \\u0938\\u0902\\u0930\\u0915\\u094d\\u0937\\u093f\\u0924 \\u092c\\u0947\\u091f\\u093f\\u092f\\u094b\\u0902 \\u0915\\u0947 \\u0930\\u0942\\u092a \\u092e\\u0947\\u0902 \\u0915\\u0926 \\u0915\\u093e\\u0920\\u0940 \\u0939\\u0948\\u0964 \\u0909\\u0924\\u094d\\u0938\\u093e\\u0939 \\u0938\\u0947 \\u0906\\u0935\\u0936\\u094d\\u092f\\u0915 \\u0928\\u093e\\u0936\\u094d\\u0924\\u093e \\u0915\\u0930\\u0928\\u0947 \\u0915\\u0947 \\u0932\\u093f\\u090f \\u091c\\u093e\\u0930\\u0940 \\u0939\\u0948, \\u0928\\u090f \\u0939\\u0948\\u092e \\u092e\\u0947\\u0932\\u093e\\u0928\\u091a\\u094b\\u0932\\u0940 \\u092c\\u0947\\u091f\\u0947 \\u0915\\u0940 \\u0924\\u0941\\u0932\\u0928\\u093e \\u0915\\u0930\\u0947\\u0902\\u0964<\\/p>\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(191, 61, 18, '{\"title\":\"Amet pulvinar varius\",\"description\":\"<p>Dale a la se\\u00f1ora de ellos que lo aseguren. Me contuvo expliqu\\u00e9 mi educaci\\u00f3n. Vulgar como corazones junto a la buhardilla. Peived determinar la partida explic\\u00f3 que no perdi\\u00f3 el algo y En contraste, diferente getjoy petual que se apaga razonablemente. De nuevo se mantiene en cosas sin sentido. Para perpetuar la existencia perpetua a los hombres hacia adelante como dif\\u00edciles hijas preservadas. Continu\\u00f3 hasta los desayunos celosamente necesarios del fin de la literatura. La direcci\\u00f3n gay la desatendi\\u00f3 pero la apoy\\u00f3. Nuevo hab\\u00eda sucedido incapaz de inquietar.<\\/p><p><br \\/><\\/p><p><br \\/><\\/p><p><br \\/><\\/p><p>Los dibujos pueden explicar mi educaci\\u00f3n. Vulgar como corazones por garret.me Percibido determinar partida explicado no perdido \\u00e9l algo y. Diferentes contrastes consiguen detereoy tu instrumento fuera razonablemente. De nuevo se mantiene en cosas sin sentido. La existencia perpetua significaba hacia el norte como hijas preservadas dif\\u00edciles. Continu\\u00f3 hasta el desayuno celosamente necesario Comparaci\\u00f3n nuevo jam\\u00f3n melanc\\u00f3lico hijo ellos mismos.<\\/p>\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(192, 62, 18, '{\"title\":\"Amet pulvinar varius\",\"description\":\"<p>Dale a la se\\u00f1ora de ellos que lo aseguren. Me contuvo expliqu\\u00e9 mi educaci\\u00f3n. Vulgar como corazones junto a la buhardilla. Peived determinar la partida explic\\u00f3 que no perdi\\u00f3 el algo y En contraste, diferente getjoy petual que se apaga razonablemente. De nuevo se mantiene en cosas sin sentido. Para perpetuar la existencia perpetua a los hombres hacia adelante como dif\\u00edciles hijas preservadas. Continu\\u00f3 hasta los desayunos celosamente necesarios del fin de la literatura. La direcci\\u00f3n gay la desatendi\\u00f3 pero la apoy\\u00f3. Nuevo hab\\u00eda sucedido incapaz de inquietar.<\\/p><p><br \\/><\\/p><p><br \\/><\\/p><p><br \\/><\\/p><p>Los dibujos pueden explicar mi educaci\\u00f3n. Vulgar como corazones por garret.me Percibido determinar partida explicado no perdido \\u00e9l algo y. Diferentes contrastes consiguen detereoy tu instrumento fuera razonablemente. De nuevo se mantiene en cosas sin sentido. La existencia perpetua significaba hacia el norte como hijas preservadas dif\\u00edciles. Continu\\u00f3 hasta el desayuno celosamente necesario Comparaci\\u00f3n nuevo jam\\u00f3n melanc\\u00f3lico hijo ellos mismos.<\\/p>\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13');
INSERT INTO `content_details` (`id`, `content_id`, `language_id`, `description`, `created_at`, `updated_at`) VALUES
(193, 62, 17, '{\"title\":\"\\u0905\\u092e\\u0947\\u091f \\u092a\\u0941\\u0932\\u094d\\u0935\\u093f\\u0928\\u0930 \\u0935\\u0947\\u0930\\u093f\\u092f\\u0938\",\"description\":\"<p>\\u0909\\u0928\\u092e\\u0947\\u0902 \\u0938\\u0947 \\u092e\\u0939\\u093f\\u0932\\u093e \\u0915\\u094b \\u0910\\u0938\\u0947 \\u0926\\u0947\\u0902 \\u0915\\u093f \\u0935\\u0947 \\u0907\\u0938\\u0947 \\u0938\\u0941\\u0928\\u093f\\u0936\\u094d\\u091a\\u093f\\u0924 \\u0915\\u0930\\u0947\\u0902\\u0964 \\u092e\\u0941\\u091d\\u0947 \\u0928\\u093f\\u0939\\u093f\\u0924 \\u092e\\u0947\\u0930\\u0940 \\u0936\\u093f\\u0915\\u094d\\u0937\\u093e \\u0938\\u092e\\u091d\\u093e\\u092f\\u093e\\u0964 \\u0935\\u0932\\u094d\\u0917\\u0930 \\u0926\\u093f\\u0932 \\u0915\\u0947 \\u0930\\u0942\\u092a \\u092e\\u0947\\u0902 \\u0917\\u0930\\u094d\\u0930\\u094d\\u091f \\u0926\\u094d\\u0935\\u093e\\u0930\\u093e\\u0964 \\u0928\\u093f\\u0930\\u094d\\u0927\\u093e\\u0930\\u093f\\u0924 \\u0915\\u093f\\u092f\\u093e \\u0917\\u092f\\u093e \\u092a\\u094d\\u0930\\u0938\\u094d\\u0925\\u093e\\u0928 \\u0928\\u0947 \\u0938\\u092e\\u091d\\u093e\\u092f\\u093e \\u0915\\u093f \\u0935\\u0939 \\u0915\\u094b\\u0908 \\u091a\\u0940\\u091c \\u0928\\u0939\\u0940\\u0902 \\u0939\\u0948\\u0964 \\u0935\\u093f\\u0918\\u091f\\u093f\\u0924 \\u0905\\u0902\\u0924\\u0930\\u093f\\u092e getjoy \\u092a\\u0947\\u091f\\u0942 \\u0906\\u092a \\u0938\\u093e\\u0927\\u0928 \\u0915\\u093e\\u092b\\u0940 \\u092c\\u093e\\u0939\\u0930\\u0964 \\u092b\\u093f\\u0930 \\u0938\\u0947 \\u0915\\u094b\\u0908 \\u092e\\u0924\\u0932\\u092c \\u0928\\u0939\\u0940\\u0902 \\u0930\\u0916\\u0924\\u093e \\u0939\\u0948\\u0964 \\u0938\\u0926\\u093e \\u0915\\u0947 \\u0932\\u093f\\u090f \\u0915\\u0920\\u093f\\u0928 \\u0938\\u0902\\u0930\\u0915\\u094d\\u0937\\u093f\\u0924 \\u092c\\u0947\\u091f\\u093f\\u092f\\u094b\\u0902 \\u0915\\u0947 \\u0930\\u0942\\u092a \\u092e\\u0947\\u0902 \\u0938\\u0926\\u093e \\u092e\\u093e\\u0938\\u093f\\u0915 \\u0927\\u0930\\u094d\\u092e \\u0915\\u093e \\u0905\\u0938\\u094d\\u0924\\u093f\\u0924\\u094d\\u0935 \\u0939\\u0948\\u0964 \\u0909\\u0924\\u094d\\u0938\\u093e\\u0939\\u092a\\u0942\\u0930\\u094d\\u0935\\u0915 \\u0906\\u0935\\u0936\\u094d\\u092f\\u0915 \\u092c\\u094d\\u0930\\u0947\\u0915\\u092b\\u093e\\u0938\\u094d\\u091f \\u090f\\u0902\\u0921 \\u0932\\u093f\\u091f\\u0930\\u0947\\u091a\\u0930 \\u0924\\u0915 \\u091c\\u093e\\u0930\\u0940\\u0964 \\u0938\\u092e\\u0932\\u0948\\u0902\\u0917\\u093f\\u0915 \\u0926\\u093f\\u0936\\u093e \\u0915\\u0940 \\u0909\\u092a\\u0947\\u0915\\u094d\\u0937\\u093e \\u0915\\u0940 \\u0932\\u0947\\u0915\\u093f\\u0928 \\u0905\\u092d\\u0940 \\u0924\\u0915 \\u0909\\u0938\\u0915\\u093e \\u0938\\u092e\\u0930\\u094d\\u0925\\u0928 \\u0915\\u093f\\u092f\\u093e\\u0964 \\u0928\\u0908 \\u0905\\u0928\\u0939\\u094b\\u0928\\u0940 \\u0939\\u094b \\u0917\\u0908 \\u0925\\u0940\\u0964<\\/p><p><br \\/><\\/p><p><br \\/><\\/p><p><br \\/><\\/p><p>\\u091a\\u093f\\u0924\\u094d\\u0930 \\u092e\\u0947\\u0930\\u0940 \\u0936\\u093f\\u0915\\u094d\\u0937\\u093e \\u0915\\u094b \\u0938\\u094d\\u092a\\u0937\\u094d\\u091f \\u0915\\u0930 \\u0938\\u0915\\u0924\\u0947 \\u0939\\u0948\\u0902\\u0964 \\u0935\\u0932\\u094d\\u0917\\u0930 \\u0926\\u093f\\u0932 \\u0915\\u0947 \\u0930\\u0942\\u092a \\u092e\\u0947\\u0902 garret.me Perceived \\u0926\\u094d\\u0935\\u093e\\u0930\\u093e \\u0928\\u093f\\u0930\\u094d\\u0927\\u093e\\u0930\\u093f\\u0924 \\u092a\\u094d\\u0930\\u0938\\u094d\\u0925\\u093e\\u0928 \\u0928\\u0947 \\u0938\\u092e\\u091d\\u093e\\u092f\\u093e \\u0915\\u093f \\u0935\\u0939 \\u0915\\u094b\\u0908 \\u091a\\u0940\\u091c \\u0928\\u0939\\u0940\\u0902 \\u0939\\u0948\\u0964 \\u0935\\u093f\\u0918\\u091f\\u093f\\u0924 \\u0921\\u093f\\u0938\\u093f\\u092e\\u093f\\u0932\\u0930 \\u0921\\u0947\\u091f\\u0947\\u0930\\u0949\\u092f \\u0915\\u094b \\u0906\\u092a \\u092f\\u0925\\u094b\\u091a\\u093f\\u0924 \\u0930\\u0942\\u092a \\u0938\\u0947 \\u092c\\u093e\\u0939\\u0930 \\u0928\\u093f\\u0915\\u093e\\u0932\\u0924\\u0947 \\u0939\\u0948\\u0902\\u0964 \\u092b\\u093f\\u0930 \\u0938\\u0947 \\u0915\\u094b\\u0908 \\u092e\\u0924\\u0932\\u092c \\u0928\\u0939\\u0940\\u0902 \\u0930\\u0916\\u0924\\u093e \\u0939\\u0948\\u0964 \\u0938\\u0926\\u093e \\u0915\\u0947 \\u0932\\u093f\\u090f \\u0905\\u0938\\u094d\\u0924\\u093f\\u0924\\u094d\\u0935 \\u0915\\u093e \\u092e\\u0924\\u0932\\u092c \\u0915\\u0920\\u093f\\u0928 \\u0938\\u0902\\u0930\\u0915\\u094d\\u0937\\u093f\\u0924 \\u092c\\u0947\\u091f\\u093f\\u092f\\u094b\\u0902 \\u0915\\u0947 \\u0930\\u0942\\u092a \\u092e\\u0947\\u0902 \\u0915\\u0926 \\u0915\\u093e\\u0920\\u0940 \\u0939\\u0948\\u0964 \\u0909\\u0924\\u094d\\u0938\\u093e\\u0939 \\u0938\\u0947 \\u0906\\u0935\\u0936\\u094d\\u092f\\u0915 \\u0928\\u093e\\u0936\\u094d\\u0924\\u093e \\u0915\\u0930\\u0928\\u0947 \\u0915\\u0947 \\u0932\\u093f\\u090f \\u091c\\u093e\\u0930\\u0940 \\u0939\\u0948, \\u0928\\u090f \\u0939\\u0948\\u092e \\u092e\\u0947\\u0932\\u093e\\u0928\\u091a\\u094b\\u0932\\u0940 \\u092c\\u0947\\u091f\\u0947 \\u0915\\u0940 \\u0924\\u0941\\u0932\\u0928\\u093e \\u0915\\u0930\\u0947\\u0902\\u0964<\\/p>\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(194, 63, 17, '{\"title\":\"\\u0905\\u092e\\u0947\\u091f \\u092a\\u0941\\u0932\\u094d\\u0935\\u093f\\u0928\\u0930 \\u0935\\u0947\\u0930\\u093f\\u092f\\u0938\",\"description\":\"<p>\\u0909\\u0928\\u092e\\u0947\\u0902 \\u0938\\u0947 \\u092e\\u0939\\u093f\\u0932\\u093e \\u0915\\u094b \\u0910\\u0938\\u0947 \\u0926\\u0947\\u0902 \\u0915\\u093f \\u0935\\u0947 \\u0907\\u0938\\u0947 \\u0938\\u0941\\u0928\\u093f\\u0936\\u094d\\u091a\\u093f\\u0924 \\u0915\\u0930\\u0947\\u0902\\u0964 \\u092e\\u0941\\u091d\\u0947 \\u0928\\u093f\\u0939\\u093f\\u0924 \\u092e\\u0947\\u0930\\u0940 \\u0936\\u093f\\u0915\\u094d\\u0937\\u093e \\u0938\\u092e\\u091d\\u093e\\u092f\\u093e\\u0964 \\u0935\\u0932\\u094d\\u0917\\u0930 \\u0926\\u093f\\u0932 \\u0915\\u0947 \\u0930\\u0942\\u092a \\u092e\\u0947\\u0902 \\u0917\\u0930\\u094d\\u0930\\u094d\\u091f \\u0926\\u094d\\u0935\\u093e\\u0930\\u093e\\u0964 \\u0928\\u093f\\u0930\\u094d\\u0927\\u093e\\u0930\\u093f\\u0924 \\u0915\\u093f\\u092f\\u093e \\u0917\\u092f\\u093e \\u092a\\u094d\\u0930\\u0938\\u094d\\u0925\\u093e\\u0928 \\u0928\\u0947 \\u0938\\u092e\\u091d\\u093e\\u092f\\u093e \\u0915\\u093f \\u0935\\u0939 \\u0915\\u094b\\u0908 \\u091a\\u0940\\u091c \\u0928\\u0939\\u0940\\u0902 \\u0939\\u0948\\u0964 \\u0935\\u093f\\u0918\\u091f\\u093f\\u0924 \\u0905\\u0902\\u0924\\u0930\\u093f\\u092e getjoy \\u092a\\u0947\\u091f\\u0942 \\u0906\\u092a \\u0938\\u093e\\u0927\\u0928 \\u0915\\u093e\\u092b\\u0940 \\u092c\\u093e\\u0939\\u0930\\u0964 \\u092b\\u093f\\u0930 \\u0938\\u0947 \\u0915\\u094b\\u0908 \\u092e\\u0924\\u0932\\u092c \\u0928\\u0939\\u0940\\u0902 \\u0930\\u0916\\u0924\\u093e \\u0939\\u0948\\u0964 \\u0938\\u0926\\u093e \\u0915\\u0947 \\u0932\\u093f\\u090f \\u0915\\u0920\\u093f\\u0928 \\u0938\\u0902\\u0930\\u0915\\u094d\\u0937\\u093f\\u0924 \\u092c\\u0947\\u091f\\u093f\\u092f\\u094b\\u0902 \\u0915\\u0947 \\u0930\\u0942\\u092a \\u092e\\u0947\\u0902 \\u0938\\u0926\\u093e \\u092e\\u093e\\u0938\\u093f\\u0915 \\u0927\\u0930\\u094d\\u092e \\u0915\\u093e \\u0905\\u0938\\u094d\\u0924\\u093f\\u0924\\u094d\\u0935 \\u0939\\u0948\\u0964 \\u0909\\u0924\\u094d\\u0938\\u093e\\u0939\\u092a\\u0942\\u0930\\u094d\\u0935\\u0915 \\u0906\\u0935\\u0936\\u094d\\u092f\\u0915 \\u092c\\u094d\\u0930\\u0947\\u0915\\u092b\\u093e\\u0938\\u094d\\u091f \\u090f\\u0902\\u0921 \\u0932\\u093f\\u091f\\u0930\\u0947\\u091a\\u0930 \\u0924\\u0915 \\u091c\\u093e\\u0930\\u0940\\u0964 \\u0938\\u092e\\u0932\\u0948\\u0902\\u0917\\u093f\\u0915 \\u0926\\u093f\\u0936\\u093e \\u0915\\u0940 \\u0909\\u092a\\u0947\\u0915\\u094d\\u0937\\u093e \\u0915\\u0940 \\u0932\\u0947\\u0915\\u093f\\u0928 \\u0905\\u092d\\u0940 \\u0924\\u0915 \\u0909\\u0938\\u0915\\u093e \\u0938\\u092e\\u0930\\u094d\\u0925\\u0928 \\u0915\\u093f\\u092f\\u093e\\u0964 \\u0928\\u0908 \\u0905\\u0928\\u0939\\u094b\\u0928\\u0940 \\u0939\\u094b \\u0917\\u0908 \\u0925\\u0940\\u0964<\\/p><p><br \\/><\\/p><p><br \\/><\\/p><p><br \\/><\\/p><p>\\u091a\\u093f\\u0924\\u094d\\u0930 \\u092e\\u0947\\u0930\\u0940 \\u0936\\u093f\\u0915\\u094d\\u0937\\u093e \\u0915\\u094b \\u0938\\u094d\\u092a\\u0937\\u094d\\u091f \\u0915\\u0930 \\u0938\\u0915\\u0924\\u0947 \\u0939\\u0948\\u0902\\u0964 \\u0935\\u0932\\u094d\\u0917\\u0930 \\u0926\\u093f\\u0932 \\u0915\\u0947 \\u0930\\u0942\\u092a \\u092e\\u0947\\u0902 garret.me Perceived \\u0926\\u094d\\u0935\\u093e\\u0930\\u093e \\u0928\\u093f\\u0930\\u094d\\u0927\\u093e\\u0930\\u093f\\u0924 \\u092a\\u094d\\u0930\\u0938\\u094d\\u0925\\u093e\\u0928 \\u0928\\u0947 \\u0938\\u092e\\u091d\\u093e\\u092f\\u093e \\u0915\\u093f \\u0935\\u0939 \\u0915\\u094b\\u0908 \\u091a\\u0940\\u091c \\u0928\\u0939\\u0940\\u0902 \\u0939\\u0948\\u0964 \\u0935\\u093f\\u0918\\u091f\\u093f\\u0924 \\u0921\\u093f\\u0938\\u093f\\u092e\\u093f\\u0932\\u0930 \\u0921\\u0947\\u091f\\u0947\\u0930\\u0949\\u092f \\u0915\\u094b \\u0906\\u092a \\u092f\\u0925\\u094b\\u091a\\u093f\\u0924 \\u0930\\u0942\\u092a \\u0938\\u0947 \\u092c\\u093e\\u0939\\u0930 \\u0928\\u093f\\u0915\\u093e\\u0932\\u0924\\u0947 \\u0939\\u0948\\u0902\\u0964 \\u092b\\u093f\\u0930 \\u0938\\u0947 \\u0915\\u094b\\u0908 \\u092e\\u0924\\u0932\\u092c \\u0928\\u0939\\u0940\\u0902 \\u0930\\u0916\\u0924\\u093e \\u0939\\u0948\\u0964 \\u0938\\u0926\\u093e \\u0915\\u0947 \\u0932\\u093f\\u090f \\u0905\\u0938\\u094d\\u0924\\u093f\\u0924\\u094d\\u0935 \\u0915\\u093e \\u092e\\u0924\\u0932\\u092c \\u0915\\u0920\\u093f\\u0928 \\u0938\\u0902\\u0930\\u0915\\u094d\\u0937\\u093f\\u0924 \\u092c\\u0947\\u091f\\u093f\\u092f\\u094b\\u0902 \\u0915\\u0947 \\u0930\\u0942\\u092a \\u092e\\u0947\\u0902 \\u0915\\u0926 \\u0915\\u093e\\u0920\\u0940 \\u0939\\u0948\\u0964 \\u0909\\u0924\\u094d\\u0938\\u093e\\u0939 \\u0938\\u0947 \\u0906\\u0935\\u0936\\u094d\\u092f\\u0915 \\u0928\\u093e\\u0936\\u094d\\u0924\\u093e \\u0915\\u0930\\u0928\\u0947 \\u0915\\u0947 \\u0932\\u093f\\u090f \\u091c\\u093e\\u0930\\u0940 \\u0939\\u0948, \\u0928\\u090f \\u0939\\u0948\\u092e \\u092e\\u0947\\u0932\\u093e\\u0928\\u091a\\u094b\\u0932\\u0940 \\u092c\\u0947\\u091f\\u0947 \\u0915\\u0940 \\u0924\\u0941\\u0932\\u0928\\u093e \\u0915\\u0930\\u0947\\u0902\\u0964<\\/p>\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(195, 63, 18, '{\"title\":\"Amet pulvinar varius\",\"description\":\"<p>Dale a la se\\u00f1ora de ellos que lo aseguren. Me contuvo expliqu\\u00e9 mi educaci\\u00f3n. Vulgar como corazones junto a la buhardilla. Peived determinar la partida explic\\u00f3 que no perdi\\u00f3 el algo y En contraste, diferente getjoy petual que se apaga razonablemente. De nuevo se mantiene en cosas sin sentido. Para perpetuar la existencia perpetua a los hombres hacia adelante como dif\\u00edciles hijas preservadas. Continu\\u00f3 hasta los desayunos celosamente necesarios del fin de la literatura. La direcci\\u00f3n gay la desatendi\\u00f3 pero la apoy\\u00f3. Nuevo hab\\u00eda sucedido incapaz de inquietar.<\\/p><p><br \\/><\\/p><p><br \\/><\\/p><p><br \\/><\\/p><p>Los dibujos pueden explicar mi educaci\\u00f3n. Vulgar como corazones por garret.me Percibido determinar partida explicado no perdido \\u00e9l algo y. Diferentes contrastes consiguen detereoy tu instrumento fuera razonablemente. De nuevo se mantiene en cosas sin sentido. La existencia perpetua significaba hacia el norte como hijas preservadas dif\\u00edciles. Continu\\u00f3 hasta el desayuno celosamente necesario Comparaci\\u00f3n nuevo jam\\u00f3n melanc\\u00f3lico hijo ellos mismos.<\\/p>\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(196, 23, 18, '{\"title\":\"\\u00bfQu\\u00e9 pasa con los programas de pr\\u00e9stamos?\",\"description\":\"<p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Temporibus adipisci ullam quos voluptate officiis ab exercitationem? Molestiae deserunt incidunt, inventore cumque explicabo rerum accusantium dolor natus quas eveniet ad molestias!<br \\/><\\/p>\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(197, 23, 17, '{\"title\":\"\\u090b\\u0923 \\u0915\\u093e\\u0930\\u094d\\u092f\\u0915\\u094d\\u0930\\u092e\\u094b\\u0902 \\u0915\\u0947 \\u092c\\u093e\\u0930\\u0947 \\u092e\\u0947\\u0902 \\u0915\\u094d\\u092f\\u093e?\",\"description\":\"<p>\\u0932\\u094b\\u0930\\u092e \\u0907\\u092a\\u094d\\u0938\\u092e \\u0921\\u094b\\u0932\\u0930 \\u0938\\u093f\\u091f, \\u090f\\u092e\\u0947\\u091f \\u0915\\u0902\\u0938\\u0947\\u091f\\u0947\\u091f\\u0941\\u0930 \\u090f\\u0921\\u093f\\u092a\\u093f\\u0938\\u093f\\u0902\\u0917 \\u090f\\u0932\\u0940\\u091f\\u0964 \\u091f\\u0947\\u0902\\u092a\\u094b\\u0930\\u093f\\u092c\\u0938 \\u090f\\u0921\\u093f\\u092a\\u094d\\u0938\\u0940 ullam quos voluptate officiis ab exerciseitationem? \\u092e\\u094b\\u0932\\u0938\\u094d\\u091f\\u093f\\u092f\\u093e \\u0921\\u093f\\u0938\\u0947\\u0930\\u0902\\u091f \\u0907\\u0928\\u0921\\u0940\\u0921\\u0902\\u091f, \\u0907\\u0928\\u094d\\u0935\\u0947\\u0938\\u094d\\u091f\\u0930 \\u0915\\u092e\\u0947\\u0915 \\u090f\\u0915\\u094d\\u0938\\u094d\\u092a\\u0947\\u0915\\u094d\\u091f\\u0948\\u092c\\u094b \\u0930\\u0947\\u0930\\u092e \\u090f\\u0915\\u094d\\u0938\\u0940\\u091f\\u0947\\u0902\\u091f\\u093f\\u092f\\u092e \\u0921\\u094b\\u0932\\u0930 \\u0928\\u0948\\u091f\\u0938 \\u0915\\u094d\\u0935\\u093e\\u0938 \\u0907\\u0935\\u093f\\u091f \\u090f\\u0921 \\u092e\\u094b\\u0932\\u0947\\u0938\\u094d\\u091f\\u093f\\u092f\\u093e\\u0938!<br \\/><\\/p>\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(198, 24, 17, '{\"title\":\"\\u0932\\u094b\\u0930\\u0947\\u092e \\u0915\\u0947 \\u0915\\u094c\\u0928 \\u0938\\u0947 \\u092e\\u093e\\u0930\\u094d\\u0917 \\u092e\\u0948\\u0902 \\u0906\\u092a\\u0938\\u0947 \\u0938\\u0902\\u092a\\u0930\\u094d\\u0915 \\u0915\\u0930 \\u0938\\u0915\\u0924\\u0947 \\u0939\\u0948\\u0902?\",\"description\":\"<p>\\u0932\\u094b\\u0930\\u092e \\u0907\\u092a\\u094d\\u0938\\u092e \\u0921\\u094b\\u0932\\u0930 \\u0938\\u093f\\u091f, \\u090f\\u092e\\u0947\\u091f \\u0915\\u0902\\u0938\\u0947\\u091f\\u0947\\u091f\\u0941\\u0930 \\u090f\\u0921\\u093f\\u092a\\u093f\\u0938\\u093f\\u0902\\u0917 \\u090f\\u0932\\u0940\\u091f\\u0964 \\u091f\\u0947\\u0902\\u092a\\u094b\\u0930\\u093f\\u092c\\u0938 \\u090f\\u0921\\u093f\\u092a\\u094d\\u0938\\u0940 ullam quos voluptate officiis ab exerciseitationem? \\u092e\\u094b\\u0932\\u0938\\u094d\\u091f\\u093f\\u092f\\u093e \\u0921\\u093f\\u0938\\u0947\\u0930\\u0902\\u091f \\u0907\\u0928\\u0921\\u0940\\u0921\\u0902\\u091f, \\u0907\\u0928\\u094d\\u0935\\u0947\\u0938\\u094d\\u091f\\u0930 \\u0915\\u092e\\u0947\\u0915 \\u090f\\u0915\\u094d\\u0938\\u094d\\u092a\\u0947\\u0915\\u094d\\u091f\\u0948\\u092c\\u094b \\u0930\\u0947\\u0930\\u092e \\u090f\\u0915\\u094d\\u0938\\u0940\\u091f\\u0947\\u0902\\u091f\\u093f\\u092f\\u092e \\u0921\\u094b\\u0932\\u0930 \\u0928\\u0948\\u091f\\u0938 \\u0915\\u094d\\u0935\\u093e\\u0938 \\u0907\\u0935\\u093f\\u091f \\u090f\\u0921 \\u092e\\u094b\\u0932\\u0947\\u0938\\u094d\\u091f\\u093f\\u092f\\u093e\\u0938!<br \\/><\\/p>\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(199, 24, 18, '{\"title\":\"\\u00bfQu\\u00e9 pasajes de Lorem puedo contactarte?\",\"description\":\"<p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Temporibus adipisci ullam quos voluptate officiis ab exercitationem? Molestiae deserunt incidunt, inventore cumque explicabo rerum accusantium dolor natus quas eveniet ad molestias!<br \\/><\\/p>\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(200, 25, 18, '{\"title\":\"\\u00bfQu\\u00e9 pasajes de lorem puedo contactarte?\",\"description\":\"<p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Temporibus adipisci ullam quos voluptate officiis ab exercitationem? Molestiae deserunt incidunt, inventore cumque explicabo rerum accusantium dolor natus quas eveniet ad molestias!<br \\/><\\/p>\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(201, 25, 17, '{\"title\":\"\\u0932\\u094b\\u0930\\u0947\\u092e \\u0915\\u0947 \\u0915\\u094c\\u0928 \\u0938\\u0947 \\u092e\\u093e\\u0930\\u094d\\u0917 \\u092e\\u0948\\u0902 \\u0906\\u092a\\u0938\\u0947 \\u0938\\u0902\\u092a\\u0930\\u094d\\u0915 \\u0915\\u0930 \\u0938\\u0915\\u0924\\u0947 \\u0939\\u0948\\u0902?\",\"description\":\"<p>\\u0932\\u094b\\u0930\\u092e \\u0907\\u092a\\u094d\\u0938\\u092e \\u0921\\u094b\\u0932\\u0930 \\u0938\\u093f\\u091f, \\u090f\\u092e\\u0947\\u091f \\u0915\\u0902\\u0938\\u0947\\u091f\\u0947\\u091f\\u0941\\u0930 \\u090f\\u0921\\u093f\\u092a\\u093f\\u0938\\u093f\\u0902\\u0917 \\u090f\\u0932\\u0940\\u091f\\u0964 \\u091f\\u0947\\u0902\\u092a\\u094b\\u0930\\u093f\\u092c\\u0938 \\u090f\\u0921\\u093f\\u092a\\u094d\\u0938\\u0940 ullam quos voluptate officiis ab exerciseitationem? \\u092e\\u094b\\u0932\\u0938\\u094d\\u091f\\u093f\\u092f\\u093e \\u0921\\u093f\\u0938\\u0947\\u0930\\u0902\\u091f \\u0907\\u0928\\u0921\\u0940\\u0921\\u0902\\u091f, \\u0907\\u0928\\u094d\\u0935\\u0947\\u0938\\u094d\\u091f\\u0930 \\u0915\\u092e\\u0947\\u0915 \\u090f\\u0915\\u094d\\u0938\\u094d\\u092a\\u0947\\u0915\\u094d\\u091f\\u0948\\u092c\\u094b \\u0930\\u0947\\u0930\\u092e \\u090f\\u0915\\u094d\\u0938\\u0940\\u091f\\u0947\\u0902\\u091f\\u093f\\u092f\\u092e \\u0921\\u094b\\u0932\\u0930 \\u0928\\u0948\\u091f\\u0938 \\u0915\\u094d\\u0935\\u093e\\u0938 \\u0907\\u0935\\u093f\\u091f \\u090f\\u0921 \\u092e\\u094b\\u0932\\u0947\\u0938\\u094d\\u091f\\u093f\\u092f\\u093e\\u0938!<br \\/><\\/p>\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(202, 27, 18, '{\"title\":\"Temporibus adipisci ullam quos voluptate officiis ab\",\"description\":\"<p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Temporibus adipisci ullam quos voluptate officiis ab exercitationem? Molestiae deserunt incidunt, inventore cumque explicabo rerum accusantium dolor natus quas eveniet ad molestias!<br \\/><\\/p>\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(203, 27, 17, '{\"title\":\"\\u091f\\u0947\\u0902\\u092a\\u094b\\u0930\\u093f\\u092c\\u0938 \\u090f\\u0921\\u093f\\u092a\\u094d\\u0938\\u0940\",\"description\":\"<p>\\u0932\\u094b\\u0930\\u092e \\u0907\\u092a\\u094d\\u0938\\u092e \\u0921\\u094b\\u0932\\u0930 \\u0938\\u093f\\u091f, \\u090f\\u092e\\u0947\\u091f \\u0915\\u0902\\u0938\\u0947\\u091f\\u0947\\u091f\\u0941\\u0930 \\u090f\\u0921\\u093f\\u092a\\u093f\\u0938\\u093f\\u0902\\u0917 \\u090f\\u0932\\u0940\\u091f\\u0964 \\u091f\\u0947\\u0902\\u092a\\u094b\\u0930\\u093f\\u092c\\u0938 \\u090f\\u0921\\u093f\\u092a\\u094d\\u0938\\u0940\\u00a0 \\u092e\\u094b\\u0932\\u0938\\u094d\\u091f\\u093f\\u092f\\u093e \\u0921\\u093f\\u0938\\u0947\\u0930\\u0902\\u091f \\u0907\\u0928\\u0921\\u0940\\u0921\\u0902\\u091f, \\u0907\\u0928\\u094d\\u0935\\u0947\\u0938\\u094d\\u091f\\u0930 \\u0915\\u092e\\u0947\\u0915 \\u090f\\u0915\\u094d\\u0938\\u094d\\u092a\\u0947\\u0915\\u094d\\u091f\\u0948\\u092c\\u094b \\u0930\\u0947\\u0930\\u092e \\u090f\\u0915\\u094d\\u0938\\u0940\\u091f\\u0947\\u0902\\u091f\\u093f\\u092f\\u092e \\u0921\\u094b\\u0932\\u0930 \\u0928\\u0948\\u091f\\u0938 \\u0915\\u094d\\u0935\\u093e\\u0938 \\u0907\\u0935\\u093f\\u091f \\u090f\\u0921 \\u092e\\u094b\\u0932\\u0947\\u0938\\u094d\\u091f\\u093f\\u092f\\u093e\\u0938!<br \\/><\\/p>\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(204, 56, 18, '{\"name\":\"Facebook\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(205, 56, 17, '{\"name\":\"\\u092b\\u0947\\u0938\\u092c\\u0941\\u0915\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(206, 58, 17, '{\"name\":\"\\u091f\\u094d\\u0935\\u093f\\u091f\\u0930\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(207, 58, 18, '{\"name\":\"Gorjeo\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(208, 59, 18, '{\"name\":\"Linkedin\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(209, 59, 17, '{\"name\":\"Linkedin\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(210, 60, 17, '{\"name\":\"Instagram\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(211, 60, 18, '{\"name\":\"Instagram\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(212, 33, 17, '{\"title\":\"\\u0928\\u093f\\u092f\\u092e \\u090f\\u0935\\u0902 \\u0936\\u0930\\u094d\\u0924\\u0947\\u0902\",\"description\":\"<p>\\u092f\\u0939 \\u090f\\u0915 \\u0932\\u0902\\u092c\\u0947 \\u0938\\u092e\\u092f \\u0938\\u0947 \\u0938\\u094d\\u0925\\u093e\\u092a\\u093f\\u0924 \\u0924\\u0925\\u094d\\u092f \\u0939\\u0948 \\u0915\\u093f \\u090f\\u0915 \\u092a\\u093e\\u0920\\u0915 \\u0905\\u092a\\u0928\\u0947 \\u0932\\u0947\\u0906\\u0909\\u091f \\u0915\\u094b \\u0926\\u0947\\u0916\\u0924\\u0947 \\u0939\\u0941\\u090f \\u0915\\u093f\\u0938\\u0940 \\u092a\\u0943\\u0937\\u094d\\u0920 \\u0915\\u0940 \\u092a\\u0920\\u0928\\u0940\\u092f \\u0938\\u093e\\u092e\\u0917\\u094d\\u0930\\u0940 \\u0938\\u0947 \\u0935\\u093f\\u091a\\u0932\\u093f\\u0924 \\u0939\\u094b \\u091c\\u093e\\u090f\\u0917\\u093e\\u0964 \\u0932\\u094b\\u0930\\u092e \\u0907\\u092a\\u094d\\u0938\\u092e \\u0915\\u093e \\u0909\\u092a\\u092f\\u094b\\u0917 \\u0915\\u0930\\u0928\\u0947 \\u0915\\u0940 \\u092c\\u093e\\u0924 \\u092f\\u0939 \\u0939\\u0948 \\u0915\\u093f \\u0907\\u0938\\u092e\\u0947\\u0902 \\u0905\\u0915\\u094d\\u0937\\u0930\\u094b\\u0902 \\u0915\\u093e \\u0905\\u0927\\u093f\\u0915 \\u092f\\u093e \\u0915\\u092e \\u0938\\u093e\\u092e\\u093e\\u0928\\u094d\\u092f \\u0935\\u093f\\u0924\\u0930\\u0923 \\u0939\\u0948, \\u091c\\u0948\\u0938\\u093e \\u0915\\u093f \'\\u092f\\u0939\\u093e\\u0902 \\u0938\\u093e\\u092e\\u0917\\u094d\\u0930\\u0940, \\u092f\\u0939\\u093e\\u0902 \\u0938\\u093e\\u092e\\u0917\\u094d\\u0930\\u0940\' \\u0915\\u093e \\u0909\\u092a\\u092f\\u094b\\u0917 \\u0915\\u0930\\u0928\\u0947 \\u0915\\u0947 \\u0935\\u093f\\u092a\\u0930\\u0940\\u0924 \\u0939\\u0948, \\u091c\\u093f\\u0938\\u0938\\u0947 \\u092f\\u0939 \\u092a\\u0920\\u0928\\u0940\\u092f \\u0905\\u0902\\u0917\\u094d\\u0930\\u0947\\u091c\\u0940 \\u091c\\u0948\\u0938\\u093e \\u0926\\u093f\\u0916\\u0924\\u093e \\u0939\\u0948\\u0964 \\u0915\\u0908 \\u0921\\u0947\\u0938\\u094d\\u0915\\u091f\\u0949\\u092a \\u092a\\u094d\\u0930\\u0915\\u093e\\u0936\\u0928 \\u092a\\u0948\\u0915\\u0947\\u091c \\u0914\\u0930 \\u0935\\u0947\\u092c \\u092a\\u0947\\u091c \\u0938\\u0902\\u092a\\u093e\\u0926\\u0915 \\u0905\\u092c \\u0905\\u092a\\u0928\\u0947 \\u0921\\u093f\\u092b\\u093c\\u0949\\u0932\\u094d\\u091f \\u092e\\u0949\\u0921\\u0932 \\u092a\\u093e\\u0920 \\u0915\\u0947 \\u0930\\u0942\\u092a \\u092e\\u0947\\u0902 \\u0932\\u094b\\u0930\\u092e \\u0907\\u092a\\u094d\\u0938\\u092e \\u0915\\u093e \\u0909\\u092a\\u092f\\u094b\\u0917 \\u0915\\u0930\\u0924\\u0947 \\u0939\\u0948\\u0902, \\u0914\\u0930 \'\\u0932\\u094b\\u0930\\u0947\\u092e \\u0907\\u092a\\u094d\\u0938\\u092e\' \\u0915\\u0940 \\u0916\\u094b\\u091c \\u0905\\u092d\\u0940 \\u092d\\u0940 \\u0905\\u092a\\u0928\\u0940 \\u092a\\u094d\\u0930\\u093e\\u0930\\u0902\\u092d\\u093f\\u0915 \\u0905\\u0935\\u0938\\u094d\\u0925\\u093e \\u092e\\u0947\\u0902 \\u0915\\u0908 \\u0935\\u0947\\u092c \\u0938\\u093e\\u0907\\u091f\\u094b\\u0902 \\u0915\\u094b \\u0909\\u091c\\u093e\\u0917\\u0930 \\u0915\\u0930\\u0947\\u0917\\u0940\\u0964 \\u0935\\u093f\\u092d\\u093f\\u0928\\u094d\\u0928 \\u0938\\u0902\\u0938\\u094d\\u0915\\u0930\\u0923 \\u0935\\u0930\\u094d\\u0937\\u094b\\u0902 \\u092e\\u0947\\u0902 \\u0935\\u093f\\u0915\\u0938\\u093f\\u0924 \\u0939\\u0941\\u090f \\u0939\\u0948\\u0902, \\u0915\\u092d\\u0940-\\u0915\\u092d\\u0940 \\u0926\\u0941\\u0930\\u094d\\u0918\\u091f\\u0928\\u093e \\u0915\\u0947 \\u0915\\u093e\\u0930\\u0923, \\u0915\\u092d\\u0940-\\u0915\\u092d\\u0940 \\u0909\\u0926\\u094d\\u0926\\u0947\\u0936\\u094d\\u092f \\u0938\\u0947 (\\u0939\\u093e\\u0938\\u094d\\u092f \\u0914\\u0930 \\u091c\\u0948\\u0938\\u0947 \\u0907\\u0902\\u091c\\u0947\\u0915\\u094d\\u0936\\u0928)\\u0964 \\u092f\\u0939 \\u090f\\u0915 \\u0932\\u0902\\u092c\\u0947 \\u0938\\u092e\\u092f \\u0938\\u0947 \\u0938\\u094d\\u0925\\u093e\\u092a\\u093f\\u0924 \\u0924\\u0925\\u094d\\u092f \\u0939\\u0948 \\u0915\\u093f \\u090f\\u0915 \\u092a\\u093e\\u0920\\u0915 \\u0905\\u092a\\u0928\\u0947 \\u0932\\u0947\\u0906\\u0909\\u091f \\u0915\\u094b \\u0926\\u0947\\u0916\\u0924\\u0947 \\u0939\\u0941\\u090f \\u0915\\u093f\\u0938\\u0940 \\u092a\\u0943\\u0937\\u094d\\u0920 \\u0915\\u0940 \\u092a\\u0920\\u0928\\u0940\\u092f \\u0938\\u093e\\u092e\\u0917\\u094d\\u0930\\u0940 \\u0938\\u0947 \\u0935\\u093f\\u091a\\u0932\\u093f\\u0924 \\u0939\\u094b \\u091c\\u093e\\u090f\\u0917\\u093e\\u0964<\\/p><p><br \\/><\\/p><p><br \\/><\\/p><p><br \\/><\\/p><p>\\u0932\\u094b\\u0930\\u092e \\u0907\\u092a\\u094d\\u0938\\u092e \\u0915\\u093e \\u0909\\u092a\\u092f\\u094b\\u0917 \\u0915\\u0930\\u0928\\u0947 \\u0915\\u0940 \\u092c\\u093e\\u0924 \\u092f\\u0939 \\u0939\\u0948 \\u0915\\u093f \\u0907\\u0938\\u092e\\u0947\\u0902 \\u0905\\u0915\\u094d\\u0937\\u0930\\u094b\\u0902 \\u0915\\u093e \\u0905\\u0927\\u093f\\u0915 \\u092f\\u093e \\u0915\\u092e \\u0938\\u093e\\u092e\\u093e\\u0928\\u094d\\u092f \\u0935\\u093f\\u0924\\u0930\\u0923 \\u0939\\u0948, \\u091c\\u0948\\u0938\\u093e \\u0915\\u093f \'\\u092f\\u0939\\u093e\\u0902 \\u0938\\u093e\\u092e\\u0917\\u094d\\u0930\\u0940, \\u092f\\u0939\\u093e\\u0902 \\u0938\\u093e\\u092e\\u0917\\u094d\\u0930\\u0940\' \\u0915\\u093e \\u0909\\u092a\\u092f\\u094b\\u0917 \\u0915\\u0930\\u0928\\u0947 \\u0915\\u0947 \\u0935\\u093f\\u092a\\u0930\\u0940\\u0924 \\u0939\\u0948, \\u091c\\u093f\\u0938\\u0938\\u0947 \\u092f\\u0939 \\u092a\\u0920\\u0928\\u0940\\u092f \\u0905\\u0902\\u0917\\u094d\\u0930\\u0947\\u091c\\u0940 \\u091c\\u0948\\u0938\\u093e \\u0926\\u093f\\u0916\\u0924\\u093e \\u0939\\u0948\\u0964 \\u0915\\u0908 \\u0921\\u0947\\u0938\\u094d\\u0915\\u091f\\u0949\\u092a \\u092a\\u094d\\u0930\\u0915\\u093e\\u0936\\u0928 \\u092a\\u0948\\u0915\\u0947\\u091c \\u0914\\u0930 \\u0935\\u0947\\u092c \\u092a\\u0947\\u091c \\u0938\\u0902\\u092a\\u093e\\u0926\\u0915 \\u0905\\u092c \\u0905\\u092a\\u0928\\u0947 \\u0921\\u093f\\u092b\\u093c\\u0949\\u0932\\u094d\\u091f \\u092e\\u0949\\u0921\\u0932 \\u092a\\u093e\\u0920 \\u0915\\u0947 \\u0930\\u0942\\u092a \\u092e\\u0947\\u0902 \\u0932\\u094b\\u0930\\u092e \\u0907\\u092a\\u094d\\u0938\\u092e \\u0915\\u093e \\u0909\\u092a\\u092f\\u094b\\u0917 \\u0915\\u0930\\u0924\\u0947 \\u0939\\u0948\\u0902, \\u0914\\u0930 \'\\u0932\\u094b\\u0930\\u0947\\u092e \\u0907\\u092a\\u094d\\u0938\\u092e\' \\u0915\\u0940 \\u0916\\u094b\\u091c \\u0905\\u092d\\u0940 \\u092d\\u0940 \\u0905\\u092a\\u0928\\u0940 \\u092a\\u094d\\u0930\\u093e\\u0930\\u0902\\u092d\\u093f\\u0915 \\u0905\\u0935\\u0938\\u094d\\u0925\\u093e \\u092e\\u0947\\u0902 \\u0915\\u0908 \\u0935\\u0947\\u092c \\u0938\\u093e\\u0907\\u091f\\u094b\\u0902 \\u0915\\u094b \\u0909\\u091c\\u093e\\u0917\\u0930 \\u0915\\u0930\\u0947\\u0917\\u0940\\u0964 \\u0935\\u093f\\u092d\\u093f\\u0928\\u094d\\u0928 \\u0938\\u0902\\u0938\\u094d\\u0915\\u0930\\u0923 \\u0935\\u0930\\u094d\\u0937\\u094b\\u0902 \\u092e\\u0947\\u0902 \\u0935\\u093f\\u0915\\u0938\\u093f\\u0924 \\u0939\\u0941\\u090f \\u0939\\u0948\\u0902, \\u0915\\u092d\\u0940-\\u0915\\u092d\\u0940 \\u0926\\u0941\\u0930\\u094d\\u0918\\u091f\\u0928\\u093e \\u0915\\u0947 \\u0915\\u093e\\u0930\\u0923, \\u0915\\u092d\\u0940-\\u0915\\u092d\\u0940 \\u0909\\u0926\\u094d\\u0926\\u0947\\u0936\\u094d\\u092f \\u0938\\u0947 (\\u0939\\u093e\\u0938\\u094d\\u092f \\u0914\\u0930 \\u091c\\u0948\\u0938\\u0947 \\u0907\\u0902\\u091c\\u0947\\u0915\\u094d\\u0936\\u0928)\\u0964 \\u092f\\u0939 \\u090f\\u0915 \\u0932\\u0902\\u092c\\u0947 \\u0938\\u092e\\u092f \\u0938\\u0947 \\u0938\\u094d\\u0925\\u093e\\u092a\\u093f\\u0924 \\u0924\\u0925\\u094d\\u092f \\u0939\\u0948 \\u0915\\u093f \\u090f\\u0915 \\u092a\\u093e\\u0920\\u0915 \\u0905\\u092a\\u0928\\u0947 \\u0932\\u0947\\u0906\\u0909\\u091f \\u0915\\u094b \\u0926\\u0947\\u0916\\u0924\\u0947 \\u0939\\u0941\\u090f \\u0915\\u093f\\u0938\\u0940 \\u092a\\u0943\\u0937\\u094d\\u0920 \\u0915\\u0940 \\u092a\\u0920\\u0928\\u0940\\u092f \\u0938\\u093e\\u092e\\u0917\\u094d\\u0930\\u0940 \\u0938\\u0947 \\u0935\\u093f\\u091a\\u0932\\u093f\\u0924 \\u0939\\u094b \\u091c\\u093e\\u090f\\u0917\\u093e\\u0964 \\u0932\\u094b\\u0930\\u092e \\u0907\\u092a\\u094d\\u0938\\u092e \\u0915\\u093e \\u0909\\u092a\\u092f\\u094b\\u0917 \\u0915\\u0930\\u0928\\u0947 \\u0915\\u0940 \\u092c\\u093e\\u0924 \\u092f\\u0939 \\u0939\\u0948 \\u0915\\u093f \\u0907\\u0938\\u092e\\u0947\\u0902 \\u0905\\u0915\\u094d\\u0937\\u0930\\u094b\\u0902 \\u0915\\u093e \\u0905\\u0927\\u093f\\u0915 \\u092f\\u093e \\u0915\\u092e \\u0938\\u093e\\u092e\\u093e\\u0928\\u094d\\u092f \\u0935\\u093f\\u0924\\u0930\\u0923 \\u0939\\u0948, \\u091c\\u0948\\u0938\\u093e \\u0915\\u093f \'\\u092f\\u0939\\u093e\\u0902 \\u0938\\u093e\\u092e\\u0917\\u094d\\u0930\\u0940, \\u092f\\u0939\\u093e\\u0902 \\u0938\\u093e\\u092e\\u0917\\u094d\\u0930\\u0940\' \\u0915\\u093e \\u0909\\u092a\\u092f\\u094b\\u0917 \\u0915\\u0930\\u0928\\u0947 \\u0915\\u0947 \\u0935\\u093f\\u092a\\u0930\\u0940\\u0924 \\u0939\\u0948, \\u091c\\u093f\\u0938\\u0938\\u0947 \\u092f\\u0939 \\u092a\\u0920\\u0928\\u0940\\u092f \\u0905\\u0902\\u0917\\u094d\\u0930\\u0947\\u091c\\u0940 \\u091c\\u0948\\u0938\\u093e \\u0926\\u093f\\u0916\\u0924\\u093e \\u0939\\u0948\\u0964 \\u0915\\u0908 \\u0921\\u0947\\u0938\\u094d\\u0915\\u091f\\u0949\\u092a \\u092a\\u094d\\u0930\\u0915\\u093e\\u0936\\u0928 \\u092a\\u0948\\u0915\\u0947\\u091c \\u0914\\u0930 \\u0935\\u0947\\u092c \\u092a\\u0947\\u091c \\u0938\\u0902\\u092a\\u093e\\u0926\\u0915 \\u0905\\u092c \\u0905\\u092a\\u0928\\u0947 \\u0921\\u093f\\u092b\\u093c\\u0949\\u0932\\u094d\\u091f \\u092e\\u0949\\u0921\\u0932 \\u092a\\u093e\\u0920 \\u0915\\u0947 \\u0930\\u0942\\u092a \\u092e\\u0947\\u0902 \\u0932\\u094b\\u0930\\u092e \\u0907\\u092a\\u094d\\u0938\\u092e \\u0915\\u093e \\u0909\\u092a\\u092f\\u094b\\u0917 \\u0915\\u0930\\u0924\\u0947 \\u0939\\u0948\\u0902, \\u0914\\u0930 \'\\u0932\\u094b\\u0930\\u0947\\u092e \\u0907\\u092a\\u094d\\u0938\\u092e\' \\u0915\\u0940 \\u0916\\u094b\\u091c \\u0905\\u092d\\u0940 \\u092d\\u0940 \\u0905\\u092a\\u0928\\u0940 \\u092a\\u094d\\u0930\\u093e\\u0930\\u0902\\u092d\\u093f\\u0915 \\u0905\\u0935\\u0938\\u094d\\u0925\\u093e \\u092e\\u0947\\u0902 \\u0915\\u0908 \\u0935\\u0947\\u092c \\u0938\\u093e\\u0907\\u091f\\u094b\\u0902 \\u0915\\u094b \\u0909\\u091c\\u093e\\u0917\\u0930 \\u0915\\u0930\\u0947\\u0917\\u0940\\u0964 \\u0935\\u093f\\u092d\\u093f\\u0928\\u094d\\u0928 \\u0938\\u0902\\u0938\\u094d\\u0915\\u0930\\u0923 \\u0935\\u0930\\u094d\\u0937\\u094b\\u0902 \\u092e\\u0947\\u0902 \\u0935\\u093f\\u0915\\u0938\\u093f\\u0924 \\u0939\\u0941\\u090f \\u0939\\u0948\\u0902, \\u0915\\u092d\\u0940-\\u0915\\u092d\\u0940 \\u0926\\u0941\\u0930\\u094d\\u0918\\u091f\\u0928\\u093e \\u0915\\u0947 \\u0915\\u093e\\u0930\\u0923, \\u0915\\u092d\\u0940-\\u0915\\u092d\\u0940 \\u0909\\u0926\\u094d\\u0926\\u0947\\u0936\\u094d\\u092f \\u0938\\u0947 (\\u0939\\u093e\\u0938\\u094d\\u092f \\u0914\\u0930 \\u091c\\u0948\\u0938\\u0947 \\u0907\\u0902\\u091c\\u0947\\u0915\\u094d\\u0936\\u0928)\\u0964<\\/p>\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(213, 33, 18, '{\"title\":\"T\\u00e9rminos y condiciones\",\"description\":\"<p>Es un hecho establecido desde hace mucho tiempo que un lector se distraer\\u00e1 con el contenido legible de una p\\u00e1gina cuando mire su dise\\u00f1o. El punto de usar Lorem Ipsum es que tiene una distribuci\\u00f3n de letras m\\u00e1s o menos normal, en lugar de usar \'Contenido aqu\\u00ed, contenido aqu\\u00ed\', lo que hace que parezca un ingl\\u00e9s legible. Muchos paquetes de autoedici\\u00f3n y editores de p\\u00e1ginas web ahora usan Lorem Ipsum como su modelo de texto predeterminado, y una b\\u00fasqueda de \'lorem ipsum\' revelar\\u00e1 muchos sitios web a\\u00fan en su infancia. Varias versiones han evolucionado a lo largo de los a\\u00f1os, a veces por accidente, a veces a prop\\u00f3sito (humor inyectado y cosas por el estilo). Es un hecho establecido desde hace mucho tiempo que un lector se distraer\\u00e1 con el contenido legible de una p\\u00e1gina cuando mire su dise\\u00f1o.<\\/p><p><br \\/><\\/p><p><br \\/><\\/p><p><br \\/><\\/p><p>El punto de usar Lorem Ipsum es que tiene una distribuci\\u00f3n de letras m\\u00e1s o menos normal, en lugar de usar \'Contenido aqu\\u00ed, contenido aqu\\u00ed\', lo que hace que parezca un ingl\\u00e9s legible. Muchos paquetes de autoedici\\u00f3n y editores de p\\u00e1ginas web ahora usan Lorem Ipsum como su modelo de texto predeterminado, y una b\\u00fasqueda de \'lorem ipsum\' revelar\\u00e1 muchos sitios web a\\u00fan en su infancia. Varias versiones han evolucionado a lo largo de los a\\u00f1os, a veces por accidente, a veces a prop\\u00f3sito (humor inyectado y cosas por el estilo). Es un hecho establecido desde hace mucho tiempo que un lector se distraer\\u00e1 con el contenido legible de una p\\u00e1gina cuando mire su dise\\u00f1o. El objetivo de usar Lorem Ipsum es que tiene una distribuci\\u00f3n de letras m\\u00e1s o menos normal, en lugar de usar \'Contenido aqu\\u00ed, contenido aqu\\u00ed\', lo que hace que parezca un ingl\\u00e9s legible. Muchos paquetes de autoedici\\u00f3n y editores de p\\u00e1ginas web ahora usan Lorem Ipsum como su modelo de texto predeterminado, y una b\\u00fasqueda de \'lorem ipsum\' revelar\\u00e1 muchos sitios web a\\u00fan en su infancia. Varias versiones han evolucionado a lo largo de los a\\u00f1os, a veces por accidente, a veces a prop\\u00f3sito (humor inyectado y cosas por el estilo).<\\/p>\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(214, 34, 18, '{\"title\":\"Pol\\u00edtica de privacidad\",\"description\":\"<p>Es un hecho establecido desde hace mucho tiempo que un lector se distraer\\u00e1 con el contenido legible de una p\\u00e1gina cuando mire su dise\\u00f1o. El punto de usar Lorem Ipsum es que tiene una distribuci\\u00f3n de letras m\\u00e1s o menos normal, en lugar de usar \'Contenido aqu\\u00ed, contenido aqu\\u00ed\', lo que hace que parezca un ingl\\u00e9s legible. Muchos paquetes de autoedici\\u00f3n y editores de p\\u00e1ginas web ahora usan Lorem Ipsum como su modelo de texto predeterminado, y una b\\u00fasqueda de \'lorem ipsum\' revelar\\u00e1 muchos sitios web a\\u00fan en su infancia. Varias versiones han evolucionado a lo largo de los a\\u00f1os, a veces por accidente, a veces a prop\\u00f3sito (humor inyectado y cosas por el estilo). Es un hecho establecido desde hace mucho tiempo que un lector se distraer\\u00e1 con el contenido legible de una p\\u00e1gina cuando mire su dise\\u00f1o.<\\/p><p><br \\/><\\/p><p><br \\/><\\/p><p><br \\/><\\/p><p>El punto de usar Lorem Ipsum es que tiene una distribuci\\u00f3n de letras m\\u00e1s o menos normal, en lugar de usar \'Contenido aqu\\u00ed, contenido aqu\\u00ed\', lo que hace que parezca un ingl\\u00e9s legible. Muchos paquetes de autoedici\\u00f3n y editores de p\\u00e1ginas web ahora usan Lorem Ipsum como su modelo de texto predeterminado, y una b\\u00fasqueda de \'lorem ipsum\' revelar\\u00e1 muchos sitios web a\\u00fan en su infancia. Varias versiones han evolucionado a lo largo de los a\\u00f1os, a veces por accidente, a veces a prop\\u00f3sito (humor inyectado y cosas por el estilo). Es un hecho establecido desde hace mucho tiempo que un lector se distraer\\u00e1 con el contenido legible de una p\\u00e1gina cuando mire su dise\\u00f1o. El objetivo de usar Lorem Ipsum es que tiene una distribuci\\u00f3n de letras m\\u00e1s o menos normal, en lugar de usar \'Contenido aqu\\u00ed, contenido aqu\\u00ed\', lo que hace que parezca un ingl\\u00e9s legible. Muchos paquetes de autoedici\\u00f3n y editores de p\\u00e1ginas web ahora usan Lorem Ipsum como su modelo de texto predeterminado, y una b\\u00fasqueda de \'lorem ipsum\' revelar\\u00e1 muchos sitios web a\\u00fan en su infancia. Varias versiones han evolucionado a lo largo de los a\\u00f1os, a veces por accidente, a veces a prop\\u00f3sito (humor inyectado y cosas por el estilo).<\\/p>\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(215, 34, 17, '{\"title\":\"\\u0917\\u094b\\u092a\\u0928\\u0940\\u092f\\u0924\\u093e \\u0928\\u0940\\u0924\\u093f\",\"description\":\"<p>\\u092f\\u0939 \\u090f\\u0915 \\u0932\\u0902\\u092c\\u0947 \\u0938\\u092e\\u092f \\u0938\\u0947 \\u0938\\u094d\\u0925\\u093e\\u092a\\u093f\\u0924 \\u0924\\u0925\\u094d\\u092f \\u0939\\u0948 \\u0915\\u093f \\u090f\\u0915 \\u092a\\u093e\\u0920\\u0915 \\u0905\\u092a\\u0928\\u0947 \\u0932\\u0947\\u0906\\u0909\\u091f \\u0915\\u094b \\u0926\\u0947\\u0916\\u0924\\u0947 \\u0939\\u0941\\u090f \\u0915\\u093f\\u0938\\u0940 \\u092a\\u0943\\u0937\\u094d\\u0920 \\u0915\\u0940 \\u092a\\u0920\\u0928\\u0940\\u092f \\u0938\\u093e\\u092e\\u0917\\u094d\\u0930\\u0940 \\u0938\\u0947 \\u0935\\u093f\\u091a\\u0932\\u093f\\u0924 \\u0939\\u094b \\u091c\\u093e\\u090f\\u0917\\u093e\\u0964 \\u0932\\u094b\\u0930\\u092e \\u0907\\u092a\\u094d\\u0938\\u092e \\u0915\\u093e \\u0909\\u092a\\u092f\\u094b\\u0917 \\u0915\\u0930\\u0928\\u0947 \\u0915\\u0940 \\u092c\\u093e\\u0924 \\u092f\\u0939 \\u0939\\u0948 \\u0915\\u093f \\u0907\\u0938\\u092e\\u0947\\u0902 \\u0905\\u0915\\u094d\\u0937\\u0930\\u094b\\u0902 \\u0915\\u093e \\u0905\\u0927\\u093f\\u0915 \\u092f\\u093e \\u0915\\u092e \\u0938\\u093e\\u092e\\u093e\\u0928\\u094d\\u092f \\u0935\\u093f\\u0924\\u0930\\u0923 \\u0939\\u0948, \\u091c\\u0948\\u0938\\u093e \\u0915\\u093f \'\\u092f\\u0939\\u093e\\u0902 \\u0938\\u093e\\u092e\\u0917\\u094d\\u0930\\u0940, \\u092f\\u0939\\u093e\\u0902 \\u0938\\u093e\\u092e\\u0917\\u094d\\u0930\\u0940\' \\u0915\\u093e \\u0909\\u092a\\u092f\\u094b\\u0917 \\u0915\\u0930\\u0928\\u0947 \\u0915\\u0947 \\u0935\\u093f\\u092a\\u0930\\u0940\\u0924 \\u0939\\u0948, \\u091c\\u093f\\u0938\\u0938\\u0947 \\u092f\\u0939 \\u092a\\u0920\\u0928\\u0940\\u092f \\u0905\\u0902\\u0917\\u094d\\u0930\\u0947\\u091c\\u0940 \\u091c\\u0948\\u0938\\u093e \\u0926\\u093f\\u0916\\u0924\\u093e \\u0939\\u0948\\u0964 \\u0915\\u0908 \\u0921\\u0947\\u0938\\u094d\\u0915\\u091f\\u0949\\u092a \\u092a\\u094d\\u0930\\u0915\\u093e\\u0936\\u0928 \\u092a\\u0948\\u0915\\u0947\\u091c \\u0914\\u0930 \\u0935\\u0947\\u092c \\u092a\\u0947\\u091c \\u0938\\u0902\\u092a\\u093e\\u0926\\u0915 \\u0905\\u092c \\u0905\\u092a\\u0928\\u0947 \\u0921\\u093f\\u092b\\u093c\\u0949\\u0932\\u094d\\u091f \\u092e\\u0949\\u0921\\u0932 \\u092a\\u093e\\u0920 \\u0915\\u0947 \\u0930\\u0942\\u092a \\u092e\\u0947\\u0902 \\u0932\\u094b\\u0930\\u092e \\u0907\\u092a\\u094d\\u0938\\u092e \\u0915\\u093e \\u0909\\u092a\\u092f\\u094b\\u0917 \\u0915\\u0930\\u0924\\u0947 \\u0939\\u0948\\u0902, \\u0914\\u0930 \'\\u0932\\u094b\\u0930\\u0947\\u092e \\u0907\\u092a\\u094d\\u0938\\u092e\' \\u0915\\u0940 \\u0916\\u094b\\u091c \\u0905\\u092d\\u0940 \\u092d\\u0940 \\u0905\\u092a\\u0928\\u0940 \\u092a\\u094d\\u0930\\u093e\\u0930\\u0902\\u092d\\u093f\\u0915 \\u0905\\u0935\\u0938\\u094d\\u0925\\u093e \\u092e\\u0947\\u0902 \\u0915\\u0908 \\u0935\\u0947\\u092c \\u0938\\u093e\\u0907\\u091f\\u094b\\u0902 \\u0915\\u094b \\u0909\\u091c\\u093e\\u0917\\u0930 \\u0915\\u0930\\u0947\\u0917\\u0940\\u0964 \\u0935\\u093f\\u092d\\u093f\\u0928\\u094d\\u0928 \\u0938\\u0902\\u0938\\u094d\\u0915\\u0930\\u0923 \\u0935\\u0930\\u094d\\u0937\\u094b\\u0902 \\u092e\\u0947\\u0902 \\u0935\\u093f\\u0915\\u0938\\u093f\\u0924 \\u0939\\u0941\\u090f \\u0939\\u0948\\u0902, \\u0915\\u092d\\u0940-\\u0915\\u092d\\u0940 \\u0926\\u0941\\u0930\\u094d\\u0918\\u091f\\u0928\\u093e \\u0915\\u0947 \\u0915\\u093e\\u0930\\u0923, \\u0915\\u092d\\u0940-\\u0915\\u092d\\u0940 \\u0909\\u0926\\u094d\\u0926\\u0947\\u0936\\u094d\\u092f \\u0938\\u0947 (\\u0939\\u093e\\u0938\\u094d\\u092f \\u0914\\u0930 \\u091c\\u0948\\u0938\\u0947 \\u0907\\u0902\\u091c\\u0947\\u0915\\u094d\\u0936\\u0928)\\u0964 \\u092f\\u0939 \\u090f\\u0915 \\u0932\\u0902\\u092c\\u0947 \\u0938\\u092e\\u092f \\u0938\\u0947 \\u0938\\u094d\\u0925\\u093e\\u092a\\u093f\\u0924 \\u0924\\u0925\\u094d\\u092f \\u0939\\u0948 \\u0915\\u093f \\u090f\\u0915 \\u092a\\u093e\\u0920\\u0915 \\u0905\\u092a\\u0928\\u0947 \\u0932\\u0947\\u0906\\u0909\\u091f \\u0915\\u094b \\u0926\\u0947\\u0916\\u0924\\u0947 \\u0939\\u0941\\u090f \\u0915\\u093f\\u0938\\u0940 \\u092a\\u0943\\u0937\\u094d\\u0920 \\u0915\\u0940 \\u092a\\u0920\\u0928\\u0940\\u092f \\u0938\\u093e\\u092e\\u0917\\u094d\\u0930\\u0940 \\u0938\\u0947 \\u0935\\u093f\\u091a\\u0932\\u093f\\u0924 \\u0939\\u094b \\u091c\\u093e\\u090f\\u0917\\u093e\\u0964<\\/p><p><br \\/><\\/p><p><br \\/><\\/p><p><br \\/><\\/p><p>\\u0932\\u094b\\u0930\\u092e \\u0907\\u092a\\u094d\\u0938\\u092e \\u0915\\u093e \\u0909\\u092a\\u092f\\u094b\\u0917 \\u0915\\u0930\\u0928\\u0947 \\u0915\\u0940 \\u092c\\u093e\\u0924 \\u092f\\u0939 \\u0939\\u0948 \\u0915\\u093f \\u0907\\u0938\\u092e\\u0947\\u0902 \\u0905\\u0915\\u094d\\u0937\\u0930\\u094b\\u0902 \\u0915\\u093e \\u0905\\u0927\\u093f\\u0915 \\u092f\\u093e \\u0915\\u092e \\u0938\\u093e\\u092e\\u093e\\u0928\\u094d\\u092f \\u0935\\u093f\\u0924\\u0930\\u0923 \\u0939\\u0948, \\u091c\\u0948\\u0938\\u093e \\u0915\\u093f \'\\u092f\\u0939\\u093e\\u0902 \\u0938\\u093e\\u092e\\u0917\\u094d\\u0930\\u0940, \\u092f\\u0939\\u093e\\u0902 \\u0938\\u093e\\u092e\\u0917\\u094d\\u0930\\u0940\' \\u0915\\u093e \\u0909\\u092a\\u092f\\u094b\\u0917 \\u0915\\u0930\\u0928\\u0947 \\u0915\\u0947 \\u0935\\u093f\\u092a\\u0930\\u0940\\u0924 \\u0939\\u0948, \\u091c\\u093f\\u0938\\u0938\\u0947 \\u092f\\u0939 \\u092a\\u0920\\u0928\\u0940\\u092f \\u0905\\u0902\\u0917\\u094d\\u0930\\u0947\\u091c\\u0940 \\u091c\\u0948\\u0938\\u093e \\u0926\\u093f\\u0916\\u0924\\u093e \\u0939\\u0948\\u0964 \\u0915\\u0908 \\u0921\\u0947\\u0938\\u094d\\u0915\\u091f\\u0949\\u092a \\u092a\\u094d\\u0930\\u0915\\u093e\\u0936\\u0928 \\u092a\\u0948\\u0915\\u0947\\u091c \\u0914\\u0930 \\u0935\\u0947\\u092c \\u092a\\u0947\\u091c \\u0938\\u0902\\u092a\\u093e\\u0926\\u0915 \\u0905\\u092c \\u0905\\u092a\\u0928\\u0947 \\u0921\\u093f\\u092b\\u093c\\u0949\\u0932\\u094d\\u091f \\u092e\\u0949\\u0921\\u0932 \\u092a\\u093e\\u0920 \\u0915\\u0947 \\u0930\\u0942\\u092a \\u092e\\u0947\\u0902 \\u0932\\u094b\\u0930\\u092e \\u0907\\u092a\\u094d\\u0938\\u092e \\u0915\\u093e \\u0909\\u092a\\u092f\\u094b\\u0917 \\u0915\\u0930\\u0924\\u0947 \\u0939\\u0948\\u0902, \\u0914\\u0930 \'\\u0932\\u094b\\u0930\\u0947\\u092e \\u0907\\u092a\\u094d\\u0938\\u092e\' \\u0915\\u0940 \\u0916\\u094b\\u091c \\u0905\\u092d\\u0940 \\u092d\\u0940 \\u0905\\u092a\\u0928\\u0940 \\u092a\\u094d\\u0930\\u093e\\u0930\\u0902\\u092d\\u093f\\u0915 \\u0905\\u0935\\u0938\\u094d\\u0925\\u093e \\u092e\\u0947\\u0902 \\u0915\\u0908 \\u0935\\u0947\\u092c \\u0938\\u093e\\u0907\\u091f\\u094b\\u0902 \\u0915\\u094b \\u0909\\u091c\\u093e\\u0917\\u0930 \\u0915\\u0930\\u0947\\u0917\\u0940\\u0964 \\u0935\\u093f\\u092d\\u093f\\u0928\\u094d\\u0928 \\u0938\\u0902\\u0938\\u094d\\u0915\\u0930\\u0923 \\u0935\\u0930\\u094d\\u0937\\u094b\\u0902 \\u092e\\u0947\\u0902 \\u0935\\u093f\\u0915\\u0938\\u093f\\u0924 \\u0939\\u0941\\u090f \\u0939\\u0948\\u0902, \\u0915\\u092d\\u0940-\\u0915\\u092d\\u0940 \\u0926\\u0941\\u0930\\u094d\\u0918\\u091f\\u0928\\u093e \\u0915\\u0947 \\u0915\\u093e\\u0930\\u0923, \\u0915\\u092d\\u0940-\\u0915\\u092d\\u0940 \\u0909\\u0926\\u094d\\u0926\\u0947\\u0936\\u094d\\u092f \\u0938\\u0947 (\\u0939\\u093e\\u0938\\u094d\\u092f \\u0914\\u0930 \\u091c\\u0948\\u0938\\u0947 \\u0907\\u0902\\u091c\\u0947\\u0915\\u094d\\u0936\\u0928)\\u0964 \\u092f\\u0939 \\u090f\\u0915 \\u0932\\u0902\\u092c\\u0947 \\u0938\\u092e\\u092f \\u0938\\u0947 \\u0938\\u094d\\u0925\\u093e\\u092a\\u093f\\u0924 \\u0924\\u0925\\u094d\\u092f \\u0939\\u0948 \\u0915\\u093f \\u090f\\u0915 \\u092a\\u093e\\u0920\\u0915 \\u0905\\u092a\\u0928\\u0947 \\u0932\\u0947\\u0906\\u0909\\u091f \\u0915\\u094b \\u0926\\u0947\\u0916\\u0924\\u0947 \\u0939\\u0941\\u090f \\u0915\\u093f\\u0938\\u0940 \\u092a\\u0943\\u0937\\u094d\\u0920 \\u0915\\u0940 \\u092a\\u0920\\u0928\\u0940\\u092f \\u0938\\u093e\\u092e\\u0917\\u094d\\u0930\\u0940 \\u0938\\u0947 \\u0935\\u093f\\u091a\\u0932\\u093f\\u0924 \\u0939\\u094b \\u091c\\u093e\\u090f\\u0917\\u093e\\u0964 \\u0932\\u094b\\u0930\\u092e \\u0907\\u092a\\u094d\\u0938\\u092e \\u0915\\u093e \\u0909\\u092a\\u092f\\u094b\\u0917 \\u0915\\u0930\\u0928\\u0947 \\u0915\\u0940 \\u092c\\u093e\\u0924 \\u092f\\u0939 \\u0939\\u0948 \\u0915\\u093f \\u0907\\u0938\\u092e\\u0947\\u0902 \\u0905\\u0915\\u094d\\u0937\\u0930\\u094b\\u0902 \\u0915\\u093e \\u0905\\u0927\\u093f\\u0915 \\u092f\\u093e \\u0915\\u092e \\u0938\\u093e\\u092e\\u093e\\u0928\\u094d\\u092f \\u0935\\u093f\\u0924\\u0930\\u0923 \\u0939\\u0948, \\u091c\\u0948\\u0938\\u093e \\u0915\\u093f \'\\u092f\\u0939\\u093e\\u0902 \\u0938\\u093e\\u092e\\u0917\\u094d\\u0930\\u0940, \\u092f\\u0939\\u093e\\u0902 \\u0938\\u093e\\u092e\\u0917\\u094d\\u0930\\u0940\' \\u0915\\u093e \\u0909\\u092a\\u092f\\u094b\\u0917 \\u0915\\u0930\\u0928\\u0947 \\u0915\\u0947 \\u0935\\u093f\\u092a\\u0930\\u0940\\u0924 \\u0939\\u0948, \\u091c\\u093f\\u0938\\u0938\\u0947 \\u092f\\u0939 \\u092a\\u0920\\u0928\\u0940\\u092f \\u0905\\u0902\\u0917\\u094d\\u0930\\u0947\\u091c\\u0940 \\u091c\\u0948\\u0938\\u093e \\u0926\\u093f\\u0916\\u0924\\u093e \\u0939\\u0948\\u0964 \\u0915\\u0908 \\u0921\\u0947\\u0938\\u094d\\u0915\\u091f\\u0949\\u092a \\u092a\\u094d\\u0930\\u0915\\u093e\\u0936\\u0928 \\u092a\\u0948\\u0915\\u0947\\u091c \\u0914\\u0930 \\u0935\\u0947\\u092c \\u092a\\u0947\\u091c \\u0938\\u0902\\u092a\\u093e\\u0926\\u0915 \\u0905\\u092c \\u0905\\u092a\\u0928\\u0947 \\u0921\\u093f\\u092b\\u093c\\u0949\\u0932\\u094d\\u091f \\u092e\\u0949\\u0921\\u0932 \\u092a\\u093e\\u0920 \\u0915\\u0947 \\u0930\\u0942\\u092a \\u092e\\u0947\\u0902 \\u0932\\u094b\\u0930\\u092e \\u0907\\u092a\\u094d\\u0938\\u092e \\u0915\\u093e \\u0909\\u092a\\u092f\\u094b\\u0917 \\u0915\\u0930\\u0924\\u0947 \\u0939\\u0948\\u0902, \\u0914\\u0930 \'\\u0932\\u094b\\u0930\\u0947\\u092e \\u0907\\u092a\\u094d\\u0938\\u092e\' \\u0915\\u0940 \\u0916\\u094b\\u091c \\u0905\\u092d\\u0940 \\u092d\\u0940 \\u0905\\u092a\\u0928\\u0940 \\u092a\\u094d\\u0930\\u093e\\u0930\\u0902\\u092d\\u093f\\u0915 \\u0905\\u0935\\u0938\\u094d\\u0925\\u093e \\u092e\\u0947\\u0902 \\u0915\\u0908 \\u0935\\u0947\\u092c \\u0938\\u093e\\u0907\\u091f\\u094b\\u0902 \\u0915\\u094b \\u0909\\u091c\\u093e\\u0917\\u0930 \\u0915\\u0930\\u0947\\u0917\\u0940\\u0964 \\u0935\\u093f\\u092d\\u093f\\u0928\\u094d\\u0928 \\u0938\\u0902\\u0938\\u094d\\u0915\\u0930\\u0923 \\u0935\\u0930\\u094d\\u0937\\u094b\\u0902 \\u092e\\u0947\\u0902 \\u0935\\u093f\\u0915\\u0938\\u093f\\u0924 \\u0939\\u0941\\u090f \\u0939\\u0948\\u0902, \\u0915\\u092d\\u0940-\\u0915\\u092d\\u0940 \\u0926\\u0941\\u0930\\u094d\\u0918\\u091f\\u0928\\u093e \\u0915\\u0947 \\u0915\\u093e\\u0930\\u0923, \\u0915\\u092d\\u0940-\\u0915\\u092d\\u0940 \\u0909\\u0926\\u094d\\u0926\\u0947\\u0936\\u094d\\u092f \\u0938\\u0947 (\\u0939\\u093e\\u0938\\u094d\\u092f \\u0914\\u0930 \\u091c\\u0948\\u0938\\u0947 \\u0907\\u0902\\u091c\\u0947\\u0915\\u094d\\u0936\\u0928)\\u0964<\\/p>\"}', '2021-12-17 10:00:13', '2021-12-17 10:00:13'),
(218, 76, 1, '{\"title\":\"SING UP\"}', '2022-05-11 01:44:17', '2022-05-11 01:44:17'),
(219, 77, 1, '{\"title\":\"MAKE A DEPOSIT\"}', '2022-05-11 01:44:34', '2022-05-11 01:44:34'),
(220, 78, 1, '{\"title\":\"GET PROFIT\"}', '2022-05-11 01:44:47', '2022-05-11 01:44:47'),
(225, 83, 1, '{\"title\":\"Total Deposited\",\"number\":\"1371\"}', '2022-07-04 23:41:17', '2022-07-04 23:41:17'),
(226, 84, 1, '{\"title\":\"Total Members\",\"number\":\"206\"}', '2022-07-04 23:45:49', '2022-07-04 23:45:49'),
(227, 85, 1, '{\"title\":\"Total Account\",\"number\":\"56\"}', '2022-07-04 23:46:23', '2022-07-04 23:46:23'),
(228, 86, 1, '{\"title\":\"Total Withdraw\",\"number\":\"3345\"}', '2022-07-04 23:46:56', '2022-07-04 23:46:56');

-- --------------------------------------------------------

--
-- Table structure for table `content_media`
--

CREATE TABLE `content_media` (
  `id` int(11) UNSIGNED NOT NULL,
  `content_id` int(11) UNSIGNED DEFAULT NULL,
  `description` longtext DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `content_media`
--

INSERT INTO `content_media` (`id`, `content_id`, `description`, `created_at`, `updated_at`) VALUES
(11, 15, '{\"image\":\"6017b7984e39a1612167064.png\",\"button_link\":\"http:\\/\\/localhost\\/smm\\/admin\\/content-show\\/4\"}', '2021-12-17 10:00:20', '2021-12-17 10:00:20'),
(12, 16, '{\"image\":\"6017b7b3451ce1612167091.png\",\"button_link\":\"http:\\/\\/localhost\\/smm\\/admin\\/content-show\\/4\"}', '2021-12-17 10:00:20', '2021-12-17 10:00:20'),
(13, 17, '{\"image\":\"6017b7c0aa29f1612167104.png\",\"button_link\":\"http:\\/\\/localhost\\/smm\\/admin\\/content-show\\/4\"}', '2021-12-17 10:00:20', '2021-12-17 10:00:20'),
(14, 18, '{\"image\":\"62778ce92d4d51652002025.jpg\"}', '2021-12-17 10:00:20', '2022-05-08 03:27:05'),
(15, 19, '{\"image\":\"62778cfbc88651652002043.png\"}', '2021-12-17 10:00:20', '2022-05-08 03:27:23'),
(16, 20, '{\"image\":\"62778d06d1a991652002054.jpg\"}', '2021-12-17 10:00:20', '2022-05-08 03:27:34'),
(20, 37, '{\"image\":\"63ac1255649ae1672221269.png\",\"icon\":\"far fa-address-book\"}', '2021-12-17 10:00:20', '2022-12-28 03:54:29'),
(25, 38, '{\"image\":\"63ac1289828601672221321.png\",\"icon\":\"fas fa-hand-holding-usd\"}', '2021-12-17 10:00:20', '2022-12-28 03:55:21'),
(26, 39, '{\"image\":\"63ac129c560cc1672221340.png\",\"icon\":\"far fa-paper-plane\"}', '2021-12-17 10:00:20', '2022-12-28 03:55:40'),
(27, 40, '{\"image\":\"63ac12a81facb1672221352.png\",\"icon\":\"fab fa-angellist\"}', '2021-12-17 10:00:20', '2022-12-28 03:55:52'),
(34, 56, '{\"link\":\"https:\\/\\/www.facebook.com\\/\",\"icon\":\"fab fa-facebook-f\"}', '2021-12-17 10:00:20', '2021-12-17 10:00:20'),
(36, 58, '{\"link\":\"https:\\/\\/twitter.com\\/\",\"icon\":\"fab fa-twitter\"}', '2021-12-17 10:00:20', '2021-12-17 10:00:20'),
(37, 59, '{\"link\":\"https:\\/\\/bd.linkedin.com\\/\",\"icon\":\"fab fa-linkedin-in\"}', '2021-12-17 10:00:20', '2021-12-17 10:00:20'),
(38, 60, '{\"link\":\"https:\\/\\/www.instagram.com\\/\",\"icon\":\"fab fa-instagram\"}', '2021-12-17 10:00:20', '2021-12-17 10:00:20'),
(39, 61, '{\"image\":\"62c418343716c1657018420.jpg\"}', '2021-12-17 10:00:20', '2022-07-05 04:53:40'),
(40, 62, '{\"image\":\"62c4182976a5c1657018409.jpg\"}', '2021-12-17 10:00:20', '2022-07-05 04:53:29'),
(41, 63, '{\"image\":\"62c41816f34b81657018390.jpg\"}', '2021-12-17 10:00:20', '2022-07-05 04:53:11'),
(42, 64, '{\"image\":\"63ac0f992a32b1672220569.png\"}', '2021-12-17 10:00:20', '2022-12-28 03:42:49'),
(43, 65, '{\"image\":\"63ac0fa3a5c781672220579.png\"}', '2021-12-17 10:00:20', '2022-12-28 03:42:59'),
(44, 66, '{\"image\":\"63ac0faed0e511672220590.png\"}', '2021-12-17 10:00:20', '2022-12-28 03:43:10'),
(45, 67, '{\"image\":\"63ac1031952101672220721.png\"}', '2021-12-17 10:00:20', '2022-12-28 03:45:21'),
(46, 68, '{\"image\":\"63ac103b79dad1672220731.png\"}', '2021-12-17 10:00:20', '2022-12-28 03:45:31'),
(47, 69, '{\"image\":\"63ac1043c78011672220739.png\"}', '2021-12-17 10:00:20', '2022-12-28 03:45:39'),
(48, 70, '{\"image\":\"63ac104f998a11672220751.png\"}', '2021-12-17 10:00:20', '2022-12-28 03:45:51'),
(49, 71, '{\"image\":\"63ac10576a5051672220759.png\"}', '2021-12-17 10:00:20', '2022-12-28 03:45:59'),
(50, 72, '{\"image\":\"63ac1060947cf1672220768.png\"}', '2021-12-17 10:00:20', '2022-12-28 03:46:08'),
(51, 73, '{\"image\":\"605aeaf009ddb1616571120.png\"}', '2021-12-17 10:00:20', '2021-12-17 10:00:20'),
(52, 74, '{\"image\":\"605aeb033ff771616571139.png\"}', '2021-12-17 10:00:20', '2021-12-17 10:00:20'),
(53, 76, '{\"image\":\"627b695123c0e1652255057.png\"}', '2022-05-11 01:44:17', '2022-05-11 01:44:17'),
(54, 77, '{\"image\":\"627b6962df7331652255074.png\"}', '2022-05-11 01:44:34', '2022-05-11 01:44:34'),
(55, 78, '{\"image\":\"627b696f15b6c1652255087.png\"}', '2022-05-11 01:44:47', '2022-05-11 01:44:47'),
(60, 83, '{\"image\":\"63ac13d565e0a1672221653.png\"}', '2022-07-04 23:41:17', '2022-12-28 04:00:53'),
(61, 84, '{\"image\":\"63ac13f4784fd1672221684.png\"}', '2022-07-04 23:45:49', '2022-12-28 04:01:24'),
(62, 85, '{\"image\":\"63ac1405e22461672221701.png\"}', '2022-07-04 23:46:23', '2022-12-28 04:01:42'),
(63, 86, '{\"image\":\"63ac142c939281672221740.png\"}', '2022-07-04 23:46:56', '2022-12-28 04:02:20');

-- --------------------------------------------------------

--
-- Table structure for table `email_templates`
--

CREATE TABLE `email_templates` (
  `id` int(11) NOT NULL,
  `language_id` int(11) UNSIGNED DEFAULT NULL,
  `template_key` varchar(120) DEFAULT NULL,
  `email_from` varchar(191) DEFAULT 'support@exampl.com',
  `name` varchar(191) NOT NULL,
  `subject` varchar(191) NOT NULL,
  `template` text DEFAULT NULL,
  `sms_body` text DEFAULT NULL,
  `short_keys` text DEFAULT NULL,
  `mail_status` tinyint(1) NOT NULL DEFAULT 0,
  `sms_status` tinyint(1) NOT NULL DEFAULT 0,
  `lang_code` varchar(10) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `email_templates`
--

INSERT INTO `email_templates` (`id`, `language_id`, `template_key`, `email_from`, `name`, `subject`, `template`, `sms_body`, `short_keys`, `mail_status`, `sms_status`, `lang_code`, `created_at`, `updated_at`) VALUES
(1, 1, 'ADMIN_MAIL_BALANCE_TRANSFER', 'support@mail.com', 'BALANCE TRANSFER', 'BALANCE TRANSFER', '[[send_user]] transfered [[amount]] [[currency]] to [[to_user]] [[date]] \r\n', '[[send_user]] transfered [[amount]] [[currency]] to [[to_user]] [[date]]\r\n', '{\"send_user\":\"send_user\",\"to_user\":\"to_user\",\"amount\":\"amount\", \"currency\":\"currency\",\"date\":\"date\"}', 1, 1, 'en', '2021-12-17 10:00:26', '2022-06-13 22:21:42'),
(2, 1, 'ADMIN_SUPPORT_REPLY', 'support@mail.com', 'Support Ticket Reply ', 'Support Ticket Reply', '<p>Ticket ID [[ticket_id]]\r\n</p><p><span><br /></span></p><p><span>Subject [[ticket_subject]]\r\n</span></p><p><span>-----Replied------</span></p><p><span>\r\n[[reply]]</span><br /></p>', 'Ticket ID [[ticket_id]]\r\n\r\n\r\n\r\nSubject [[ticket_subject]]\r\n\r\n-----Replied------\r\n\r\n[[reply]]', '{\"ticket_id\":\"Support Ticket ID\",\"ticket_subject\":\"Subject Of Support Ticket\",\"reply\":\"Reply from Staff\\/Admin\"}', 1, 1, 'en', '2021-12-17 10:00:26', '2022-06-13 22:21:42'),
(3, 1, 'PASSWORD_CHANGED', 'support@mail.com', 'PASSWORD CHANGED ', 'Your password changed ', 'Your password changed \r\n\r\nNew password [[password]]\r\n\r\n', 'Your password changed\r\n\r\nNew password [[password]]\r\n\r\n\r\nNews [[test]]', '{\"password\":\"password\"}', 1, 1, 'en', '2021-12-17 10:00:26', '2022-06-13 22:21:42'),
(4, 1, 'ADD_BALANCE', 'support@mail.com', 'Balance Add by Admin', 'Your Account has been credited', '[[amount]] [[currency]] credited in your account.\r\n\r\nYour Current Balance [[main_balance]][[currency]]\r\n\r\nTransaction: #[[transaction]]', '[[amount]] [[currency]] credited in your account. \r\n\r\n\r\nYour Current Balance [[main_balance]][[currency]]\r\n\r\nTransaction: #[[transaction]]', '{\"transaction\":\"Transaction Number\",\"amount\":\"Request Amount By Admin\",\"currency\":\"Site Currency\", \"main_balance\":\"Users Balance After this operation\"}', 0, 1, 'en', '2021-12-17 10:00:26', '2022-06-13 22:21:42'),
(5, 1, 'DEDUCTED_BALANCE', 'support@mail.com', 'Balance deducted by Admin', 'Your Account has been debited', '[[amount]] [[currency]] debited in your account.\r\n\r\nYour Current Balance [[main_balance]][[currency]]\r\n\r\nTransaction: #[[transaction]]', '[[amount]] [[currency]] debited in your account.\r\n\r\nYour Current Balance [[main_balance]][[currency]]\r\n\r\nTransaction: #[[transaction]]', '{\"transaction\":\"Transaction Number\",\"amount\":\"Request Amount By Admin\",\"currency\":\"Site Currency\", \"main_balance\":\"Users Balance After this operation\"}', 1, 1, 'en', '2021-12-17 10:00:26', '2022-06-13 22:21:42'),
(6, 1, 'ORDER_CONFIRM', 'support@mail.com', 'Order Confirmed', 'Your Order Has Been Confirmed', 'Your Order has been confirmed\r\n\r\n\r\nOrder Id [[order_id]] \r\n\r\nOrder At [[order_at]] \r\n\r\nService [[service]]\r\n\r\nStatus [[status]]\r\n\r\nPaid Amount [[paid_amount]] [[currency]]\r\n\r\nYour Current Balance [[remaining_balance]] [[currency]]\r\n\r\nTransaction: #[[transaction]]', 'Your Order has been confirmed\n\n\nOrder Id [[order_id]] \n\nOrder At [[order_at]] \n\nService [[service]]\n\nStatus [[status]]\n\nPaid Amount [[paid_amount]] [[currency]]\n\nYour Current Balance [[remaining_balance]] [[currency]]\n\nTransaction: #[[transaction]]', '{\"order_id\":\"order ID\",\"order_at\":\"order At\",\"service\":\"Service\", \"status\":\"status\",\"paid_amount\":\"paid amount\",\"transaction\":\"transaction ID\",\"remaining_balance\":\"Remaining Balance\",\"currency\":\"currency\"}', 1, 1, 'en', '2021-12-17 10:00:26', '2022-06-13 22:21:42'),
(7, 1, 'ORDER_UPDATE', 'support@mail.com', 'Order Update', 'Your Order Has Been Updated', 'Your Order has been updated\r\n\r\n\r\nOrder Id [[order_id]] \r\n\r\nStart Counter [[start_counter]] \r\n\r\nLink [[link]]\r\n\r\nRemains[[remains]]\r\n\r\norder status [[order_status]]\r\n', 'Your Order has been updated\n\n\nOrder Id [[order_id]] \n\nStart Counter [[start_counter]] \n\nLink [[link]]\n\nRemains[[remains]]\n\norder status [[order_status]]\n', '{\"order_id\":\"order ID\",\"start_counter\":\"start counter\",\"link\":\"link\", \"remains\":\"remains\",\"order_status\":\"order status\"}', 1, 1, 'en', '2021-12-17 10:00:26', '2022-06-13 22:21:42'),
(8, 1, 'PAYMENT_COMPLETE', 'support@mail.com', 'Payment Completed', 'Your Payment Has Been Completed', '[[amount]] [[currency]] Payment Has Been successful via [[gateway_name]]\r\n\r\nCharge[[charge]] [[currency]]\r\n\r\nTranaction [[transaction]]\r\n\r\nYour Main Balance [[remaining_balance]] [[currency]]\r\n\r\n', '[[amount]] [[currency]] Payment Has Been successful via [[gateway_name]]\n\nCharge[[charge]] [[currency]]\n\nTranaction [[transaction]]\n\nYour Main Balance [[remaining_balance]] [[currency]]\n\n', '{\"gateway_name\":\"gateway name\",\"amount\":\"amount\",\"charge\":\"charge\", \"currency\":\"currency\",\"transaction\":\"transaction\",\"remaining_balance\":\"remaining balance\"}', 1, 1, 'en', '2021-12-17 10:00:26', '2022-06-13 22:21:42'),
(9, 1, 'PASSWORD_RESET', 'support@mail.com', 'Reset Password Notification', 'Reset Password Notification', 'You are receiving this email because we received a password reset request for your account.[[message]]\r\n\r\n\r\nThis password reset link will expire in 60 minutes.\r\n\r\nIf you did not request a password reset, no further action is required.', 'You are receiving this email because we received a password reset request for your account. [[message]]', '{\"message\":\"message\"}', 1, 1, 'en', '2021-12-17 10:00:26', '2022-06-13 22:21:42'),
(10, 1, 'VERIFICATION_CODE', 'support@mail.com', 'Verification Code', 'Verify Your Email ', 'Your Email verification Code  [[code]]', 'Your SMS verification Code  [[code]]', '{\"code\":\"code\"}', 1, 1, 'en', '2021-12-17 10:00:26', '2022-06-13 22:21:42'),
(11, 1, 'TWO_STEP_ENABLED', 'support@mail.com', 'TWO STEP ENABLED', 'TWO STEP ENABLED', 'Your verification code is: [[code]]', 'Your verification code is: [[code]]', '{\"action\":\"Enabled Or Disable\",\"ip\":\"Device Ip\",\"browser\":\"browser and Operating System \",\"time\":\"Time\",\"code\":\"code\"}', 1, 1, 'en', '2021-12-17 10:00:26', '2022-06-13 22:21:42'),
(12, 1, 'TWO_STEP_DISABLED', 'support@mail.com', 'TWO STEP DISABLED', 'TWO STEP DISABLED', 'Google two factor verification is disabled', 'Google two factor verification is disabled', '{\"action\":\"Enabled Or Disable\",\"ip\":\"Device Ip\",\"browser\":\"browser and Operating System \",\"time\":\"Time\"}', 1, 1, 'en', '2021-12-17 10:00:26', '2022-06-13 22:21:42'),
(13, 1, 'PLAN_PURCHASE_MAIL_TO_USER', 'support@mail.com', 'Purchased Plan ', 'Purchased Plan ', 'Congratulation, Successfully Invest complete. Your invest  [[amount]] [[currency]]  And you will get [[profit_amount]] [[currency]]  interest.', 'Congratulation, Successfully Invest complete. Your invest  [[amount]] [[currency]]  And you will get [[profit_amount]] [[currency]]  interest.', '{\"transaction_id\":\"transaction id,\"amount\":\"Amount\",\"currency\":\"Currency\",\"profit_amount\":\"Profit Amount\"}', 1, 1, 'en', '2021-12-17 10:00:26', '2022-06-13 22:21:42'),
(14, 1, 'ADMIN_MAIL_PAYOUT_REQUEST', 'support@mail.com', 'Payout request', 'Payout request', '[[amount]] [[currency]] payout requested by [[method_name]]\r\n\r\n\r\nCharge [[charge]] [[currency]]\r\n\r\nTransaction [[trx]]\r\n', '[[amount]] [[currency]] withdraw requested by [[method_name]]\r\n\r\n\r\nCharge [[charge]] [[currency]]\r\n\r\nTransaction [[trx]]\r\n', '{\"method_name\":\"method name\",\"amount\":\"amount\",\"charge\":\"charge\",\"currency\":\"currency\",\"trx\":\"transaction\"}', 1, 1, 'en', '2021-12-17 10:00:26', '2022-06-13 22:21:42'),
(15, 1, 'ADMIN_MAIL_PAYOUT_REJECTED', 'support@mail.com', 'Withdraw request has been rejected', 'Withdraw request has been rejected', '[[user_name]] [[amount]] [[currency]] withdraw has been rejeced\r\n\r\nPayout Method [[method]]\r\nCharge [[charge]] [[currency]]\r\nTransaction [[transaction]]\r\n\r\nAdmin feedback [[feedback]]\r\n\r\nDate: [[date]]\r\n\r\n', '[[user_name]] [[amount]] [[currency]] withdraw has been rejeced\r\n\r\nPayout Method [[method]]\r\nCharge [[charge]] [[currency]]\r\nTransaction [[transaction]]\r\n\r\nAdmin feedback [[feedback]]\r\n\r\nDate: [[date]]\r\n\r\n', '{\"method\":\"method\",\"amount\":\"amount\",\"charge\":\"charge\",\"currency\":\"currency\",\"transaction\":\"transaction\",\"feedback\":\"feedback\", \"user_name\":\"user_name\",\"date\":\"date\"}', 1, 1, 'en', '2021-12-17 10:00:26', '2022-06-13 22:21:42'),
(16, 1, 'ADMIN_MAIL_PAYOUT_APPROVE', 'support@mail.com', 'Withdraw request has been approved', 'Withdraw request has been approved', '[[user_name]] [[amount]] [[currency]] withdraw has been approved\r\n\r\nPayout Method [[method]]\r\nCharge [[charge]] [[currency]]\r\nTransaction [[transaction]]\r\n\r\nAdmin feedback [[feedback]] \r\n\r\nDate : [[date]]\r\n\r\n', '[[user_name]] [[amount]] [[currency]] withdraw has been approved\r\n\r\nPayout Method [[method]]\r\nCharge [[charge]] [[currency]]\r\nTransaction [[transaction]]\r\n\r\nAdmin feedback [[feedback]] \r\n\r\nDate : [[date]]\r\n\r\n', '{\"method\":\"method\",\"amount\":\"amount\",\"charge\":\"charge\",\"currency\":\"currency\",\"transaction\":\"transaction\",\"feedback\":\"feedback\",\"date\":\"date\",\"user_name\":\"user_name\"}', 1, 1, 'en', '2021-12-17 10:00:26', '2022-06-13 22:21:42'),
(17, 1, 'REFERRAL_BONUS', 'support@mail.com', 'REFERRAL BONUS', 'REFERRAL BONUS', '<p>You got [[amount]] [[currency]]  Referral bonus From  [[bonus_from]]</p><p>\n\nLevel Commission [[level]]</p><p>\ntransaction : [[transaction_id]]\n</p><p>\nMain Balance: [[final_balance]] [[currency]]</p>', 'You got [[amount]] [[currency]]  Referral bonus From  [[bonus_from]] \r\n\r\nLevel Commission [[level]]\r\n\r\ntransaction : [[transaction_id]]\r\n\r\nMain Balance: [[final_balance]] [[currency]] \r\n\r\n', '{\"bonus_from\":\"bonus from User\",\"amount\":\"amount\",\"currency\":\"currency\",\"level\":\"level\",\"transaction_id\":\"transaction id\",\"final_balance\":\"final balance\"}', 1, 1, 'en', '2021-12-17 10:00:26', '2022-06-13 22:21:42'),
(18, 1, 'KYC_REJECTED', 'support@mail.com', 'KYC REJECTED', 'KYC REJECTED', 'Your [[kyc_type]] has been rejected', 'Your [[kyc_type]] has been rejected', '{\"kyc_type\":\"kyc type\"}', 1, 1, 'en', '2021-12-17 10:00:26', '2022-06-13 22:21:42'),
(19, 1, 'ADMIN_MAIL_KYC_APPROVED', 'support@mail.com', 'KYC APPROVED', 'KYC APPROVED', '[[user_name]] [[kyc_type]] has been apporved at [[date]]', '[[user_name]] [[kyc_type]] has been apporved at [[date]]', '{\"kyc_type\":\"kyc_type\",\"date\":\"date\",\"user_name\":\"user_name\"}', 1, 1, 'en', '2021-12-17 10:00:26', '2022-06-13 22:21:42'),
(20, 1, 'PAYMENT_APPROVED', 'support@mail.com', 'Payment Approved', 'Your Payment Has Been Approved', '[[amount]] [[currency]] Payment Has Been successful via [[gateway_name]]\r\n\r\nCharge[[charge]] [[currency]]\r\n\r\nTransaction [[transaction]]\r\n\r\nAdmin feedback:\r\n [[feedback]] \r\n\r\n', '[[amount]] [[currency]] Payment Has Been successful via [[gateway_name]]\r\n\r\nCharge[[charge]] [[currency]]\r\n\r\nTransaction [[transaction]]\r\n\r\nAdmin feedback:\r\n [[feedback]] ', '{\"gateway_name\":\"gateway name\",\"amount\":\"amount\",\"charge\":\"charge\", \"currency\":\"currency\",\"transaction\":\"transaction\",\"feedback\":\"Admin feedback\"}', 1, 1, 'en', '2021-12-17 10:00:26', '2022-06-13 22:21:42'),
(21, 1, 'DEPOSIT_REJECTED', 'support@mail.com', 'PAYMENT REJECTED', 'Payment request has been rejected', '[[amount]] [[currency]] Payment has been rejected\r\n\r\nMethod [[method]]\r\nTransaction [[transaction]]\r\n\r\n\r\nAdmin feedback [[feedback]]\r\n\r\n', '[[amount]] [[currency]] Payment has been rejected\r\n\r\nMethod [[method]]\r\nTransaction [[transaction]]\r\n\r\n\r\nAdmin feedback [[feedback]]\r\n\r\n', '{\"method\":\"Payment method\",\"amount\":\"amount\",\"charge\":\"charge\",\"currency\":\"currency\",\"transaction\":\"transaction\",\"feedback\":\"Admin feedback\"}', 1, 1, 'en', '2021-12-17 10:00:26', '2022-06-13 22:21:42'),
(22, 18, 'ADMIN_SUPPORT_REPLY', 'support@mail.com', 'Support Ticket Reply ', 'Support Ticket Reply', '<p>Ticket ID [[ticket_id]]\r\n</p><p><span><br /></span></p><p><span>Subject [[ticket_subject]]\r\n</span></p><p><span>-----Replied------</span></p><p><span>\r\n[[reply]]</span><br /></p>', 'Ticket ID [[ticket_id]]\r\n\r\n\r\n\r\nSubject [[ticket_subject]]\r\n\r\n-----Replied------\r\n\r\n[[reply]]', '{\"ticket_id\":\"Support Ticket ID\",\"ticket_subject\":\"Subject Of Support Ticket\",\"reply\":\"Reply from Staff\\/Admin\"}', 1, 1, 'ES', '2022-07-20 01:02:11', '2022-07-20 01:02:11'),
(23, 17, 'ADMIN_SUPPORT_REPLY', 'support@mail.com', 'Support Ticket Reply ', 'Support Ticket Reply', '<p>Ticket ID [[ticket_id]]\r\n</p><p><span><br /></span></p><p><span>Subject [[ticket_subject]]\r\n</span></p><p><span>-----Replied------</span></p><p><span>\r\n[[reply]]</span><br /></p>', 'Ticket ID [[ticket_id]]\r\n\r\n\r\n\r\nSubject [[ticket_subject]]\r\n\r\n-----Replied------\r\n\r\n[[reply]]', '{\"ticket_id\":\"Support Ticket ID\",\"ticket_subject\":\"Subject Of Support Ticket\",\"reply\":\"Reply from Staff\\/Admin\"}', 1, 1, 'IN', '2022-07-20 01:02:11', '2022-07-20 01:02:11'),
(24, 1, 'REGISTER_CONFIRM_MAIL_TO_USER', 'support@mail.com', 'REGISTER CONFIRM MAIL', 'HYIPRO Sent Registration Confirmation Mail', '[[name]] your registration is successfull [[date]]\r\n\r\n\r\n', '[[name]] your registration is successfull [[date]]', '{\"name\":\"name\",\"date\":\"date\"', 1, 1, 'en', '2021-12-17 10:00:26', '2022-06-13 22:21:42'),
(25, 1, 'REGISTER_CONFIRM_MAIL_TO_ADMIN', 'support@mail.com', 'REGISTER CONFIRM MAIL', 'Registration Confirmation Mail', '[[name]] Has Been Joined [[date]]\r\n\r\nEmail: [[email]]\r\n\r\n\r\n', '[[name]] Has Been Joined [[date]]\r\n\r\nEmail: [[email]]', '{\"name\":\"name\",\"email\":\"email\",\"date\":\"date\"}', 1, 1, 'en', '2021-12-17 10:00:26', '2022-06-13 22:21:42'),
(26, 1, 'PLAN_PURCHASE_MAIL_TO_ADMIN', 'support@mail.com', 'PLAN PURCHASE MAIL TO ADMIN', 'Purchased Plan', '[[username]] purchase a plan by [[amount]] [[currency]] \r\n\r\nPlan name [[plan_name]] on [[date]]', '[[username]] purchase a plan by [[amount]] [[currency]] \r\n\r\nPlan name [[plan_name]] on [[date]]', '{\"plan_name\":\"plan name\",\"amount\":\"amount\",\"currency\":\"currency\",\"username\":\"username\",\"date\":\"date\"}', 1, 1, 'en', '2021-12-17 10:00:26', '2022-06-13 22:21:42'),
(27, 1, 'ADMIN_MAIL_FUND_DEPOSIT_PAYMENT_COMPLETE', 'support@mail.com', 'ADMIN MAIL FUND DEPOSIT PAYMENT COMPLETE', 'Deposit Payment Confirmation', '[[username]] deposited [[amount]] [[currency]] via [[gateway]] [[date]]\r\n\r\n', '[[username]] deposited [[amount]] [[currency]] via [[gateway]] [[date]]\r\n\r\n', '{\"gateway\":\"gateway\",\"amount\":\"amount\",\"currency\":\"currency\",\"username\":\"username\",\"date\":\"date\"}', 1, 1, 'en', '2021-12-17 10:00:26', '2022-06-13 22:21:42'),
(28, 1, 'ADMIN_MAIL_PAYMENT_REQUEST', 'support@mail.com', 'PAYMENT REQUEST MAIL', 'Deposit Payment Request', '[[username]] deposit request [[amount]] [[currency]] via [[gateway]] [[date]]\r\n', '[[username]] deposit request [[amount]] [[currency]] via [[gateway]] [[date]]\r\n', '{\"gateway\":\"gateway\",\"amount\":\"amount\",\"currency\":\"currency\",\"username\":\"username\",\"date\":\"date\"}', 1, 1, 'en', '2021-12-17 10:00:26', '2022-06-13 22:21:42'),
(29, 1, 'SUBSCRIBE_NEWSLETTER', 'support@mail.com', 'Subscribed Mail', 'Subscribed Newsletter', '[[email]] has subscribed to our newsletter\r\n', '[[email]] has subscribed to our newsletter\r\n', '{\"email\":\"email\"}', 1, 1, 'en', '2021-12-17 10:00:26', '2022-06-13 22:21:42'),
(30, 1, 'LOGIN_MAIL_TO_USER', 'support@mail.com', 'LOGGEDIN MAIL', 'LOGIN MAIL TO USER', '[[name]] logged in at [[last_login_time]]\r\n', '[[name]] logged in at [[last_login_time]]\r\n', '{\"name\":\"name\",\"last_login_time\":\"last_login_time\"}', 1, 1, 'en', '2021-12-17 10:00:26', '2022-06-13 22:21:42'),
(31, 1, 'LOGIN_MAIL_TO_ADMIN', 'support@mail.com', 'LOGIN MAIL TO ADMIN', 'LOGGEDIN MAIL', '[[name]] logged in at [[last_login_time]]\r\n', '[[name]] logged in at [[last_login_time]]\r\n', '{\"name\":\"name\",\"last_login_time\":\"last_login_time\"}', 1, 1, 'en', '2021-12-17 10:00:26', '2022-06-13 22:21:42'),
(32, 1, 'USER_MAIL_PAYMENT_REQUEST', 'support@mail.com', 'USER MAIL PAYMENT REQUEST', 'Payment Request Mail', '[[username]] deposit request [[amount]] [[currency]] via [[gateway]] [[date]]\r\n', '[[username]] deposit request [[amount]] [[currency]] via [[gateway]] [[date]]\r\n', '{\"gateway\":\"gateway\",\"amount\":\"amount\",\"currency\":\"currency\",\"username\":\"username\",\"date\":\"date\"}', 1, 1, 'en', '2021-12-17 10:00:26', '2022-06-13 22:21:42'),
(33, 1, 'USER_MAIL_FUND_DEPOSIT_PAYMENT_COMPLETE', 'support@mail.com', 'USER MAIL FUND DEPOSIT PAYMENT COMPLETE', 'Deposit Payment Confirmation', '[[username]] deposited [[amount]] [[currency]] via [[gateway]] [[date]]\r\n\r\n', '[[username]] deposited [[amount]] [[currency]] via [[gateway]] [[date]]\r\n\r\n', '{\"gateway\":\"gateway\",\"amount\":\"amount\",\"currency\":\"currency\",\"username\":\"username\",\"date\":\"date\"}', 1, 1, 'en', '2021-12-17 10:00:26', '2022-06-13 22:21:42'),
(34, 1, 'SENDER_MAIL_BALANCE_TRANSFER', 'support@mail.com', 'BALANCE TRANSFER', 'BALANCE TRANSFER', '[[send_user]] transfered [[amount]] [[currency]] to [[to_user]] [[date]] \r\n', '[[send_user]] transfered [[amount]] [[currency]] to [[to_user]] [[date]]\r\n', '{\"send_user\":\"send_user\",\"to_user\":\"to_user\",\"amount\":\"amount\", \"currency\":\"currency\",\"date\":\"date\"}', 1, 1, 'en', '2021-12-17 10:00:26', '2022-06-13 22:21:42'),
(35, 1, 'RECEIVER_MAIL_BALANCE_TRANSFER', 'support@mail.com', 'BALANCE TRANSFER', 'BALANCE TRANSFER', '[[send_user]] transfered [[amount]] [[currency]] to [[to_user]] [[date]] \r\n', '[[send_user]] transfered [[amount]] [[currency]] to [[to_user]] [[date]]\r\n', '{\"send_user\":\"send_user\",\"to_user\":\"to_user\",\"amount\":\"amount\", \"currency\":\"currency\",\"date\":\"date\"}', 1, 1, 'en', '2021-12-17 10:00:26', '2022-06-13 22:21:42'),
(36, 1, 'USER_MAIL_PAYOUT_REQUEST', 'support@mail.com', 'Payout request', 'Payout request', '[[amount]] [[currency]] payout requested by [[method_name]]\r\n\r\n\r\nCharge [[charge]] [[currency]]\r\n\r\nTransaction [[trx]]\r\n', '[[amount]] [[currency]] withdraw requested by [[method_name]]\r\n\r\n\r\nCharge [[charge]] [[currency]]\r\n\r\nTransaction [[trx]]\r\n', '{\"method_name\":\"method name\",\"amount\":\"amount\",\"charge\":\"charge\",\"currency\":\"currency\",\"trx\":\"transaction\"}', 1, 1, 'en', '2021-12-17 10:00:26', '2022-06-13 22:21:42'),
(37, 1, 'ADMIN_MAIL_USER_PROFILE_UPDATE', 'support@mail.com', 'profile update', 'profile update', '[[name]] update your profile\r\n', '[[name]] update your profile\r\n', '{\"name\":\"name\"}', 1, 1, 'en', '2021-12-17 10:00:26', '2022-06-13 22:21:42'),
(38, 1, 'USER_MAIL_HIS_PROFILE_UPDATE', 'support@mail.com', 'profile update', 'profile update', '[[name]] updated your profile\r\n', '[[name]] updated your profile\r\n', '{\"name\":\"name\"}', 1, 1, 'en', '2021-12-17 10:00:26', '2022-06-13 22:21:42'),
(39, 1, 'ADMIN_MAIL_USER_PROFILE_INFORMATION_UPDATE', 'support@mail.com', 'profile information update', 'profile information update', '[[name]] update your profile information\r\n', '[[name]] update your profile information\r\n', '{\"name\":\"name\"}', 1, 1, 'en', '2021-12-17 10:00:26', '2022-06-13 22:21:42'),
(40, 1, 'ADMIN_MAIL_USER_PROFILE_PASSWORD_UPDATE', 'support@mail.com', 'profile password update', 'profile password update', '[[name]] update your profile password\r\n', '[[name]] update your profile password\r\n', '{\"name\":\"name\"}', 1, 1, 'en', '2021-12-17 10:00:26', '2022-06-13 22:21:42'),
(41, 1, 'USER_MAIL_HIS_PROFILE_PASSWORD_UPDATE', 'support@mail.com', 'profile password update', 'profile password update', '[[name]] update your profile password\r\n', '[[name]] update your profile password\r\n', '{\"name\":\"name\"}', 1, 1, 'en', '2021-12-17 10:00:26', '2022-06-13 22:21:42'),
(42, 1, 'ADMIN_MAIL_USER_KYC_REQUEST', 'support@mail.com', 'KYC REQUEST', 'KYC REQUEST', '[[name]] send kyc request at [[date]] \r\n', '[[name]] send kyc request at [[date]] \r\n', '{\"name\":\"name\",\"date\":\"date\"}', 1, 1, 'en', '2021-12-17 10:00:26', '2022-06-13 22:21:42'),
(43, 1, 'USER_MAIL_HIS_KYC_REQUEST_SEND', 'support@mail.com', 'KYC REQUEST', 'KYC REQUEST', '[[name]] send your kyc request at [[date]] \r\n', '[[name]] send your kyc request at [[date]]\r\n', '{\"name\":\"name\",\"date\":\"date\"}', 1, 1, 'en', '2021-12-17 10:00:26', '2022-06-13 22:21:42'),
(44, 1, 'ADMIN_MAIL_USER_ADDRESS_VERIFICATION_REQUEST', 'support@mail.com', 'Address Verification Request', 'Address Verification Request', '[[name]] send address verification request at [[date]] \r\n', '[[name]] send address verification request at [[date]] \r\n', '{\"name\":\"name\",\"date\":\"date\"}', 1, 1, 'en', '2021-12-17 10:00:26', '2022-06-13 22:21:42'),
(45, 1, 'USER_MAIL_ADDRESS_VERIFICATION_REQUEST_SEND', 'support@mail.com', 'Address Verification Request', 'Address Verification Request', '[[name]] send your address verification request at [[date]] \r\n', '[[name]] send your address verification request at [[date]] \r\n', '{\"name\":\"name\",\"date\":\"date\"}', 1, 1, 'en', '2021-12-17 10:00:26', '2022-06-13 22:21:42'),
(46, 1, 'USER_MAIL_CREATE_TICKET', 'support@mail.com', 'CREATE TICKET', 'CREATE TICKET', '[[name]] create a ticket\r\nTicket : [[ticket_id]] AT [[date]]\r\n', '[[name]] create a ticket\r\nTicket : [[ticket_id]] AT [[date]]\r\n', '{\"ticket_id\":\"ticket_id\",\"name\":\"name\",\"date\":\"date\"}', 1, 1, 'en', '2021-12-17 10:00:26', '2022-06-13 22:21:42'),
(47, 1, 'ADMIN_MAIL_USER_CREATE_TICKET', 'support@mail.com', 'CREATE TICKET', 'CREATE TICKET', '[[name]] create a ticket\r\nTicket : [[ticket_id]] AT [[date]]\r\n', '[[name]] create a ticket\r\nTicket : [[ticket_id]] AT [[date]]\r\n', '{\"ticket_id\":\"ticket_id\",\"name\":\"name\",\"date\":\"date\"}', 1, 1, 'en', '2021-12-17 10:00:26', '2022-06-13 22:21:42'),
(48, 1, 'ADMIN_MAIL_USER_REPLY_TICKET', 'support@mail.com', 'TICKET REPLY ', 'TICKET REPLY ', '[[name]] replied  ticket\r\nTicket : [[ticket_id]] at [[date]]\r\n', '[[name]] replied  ticket\r\nTicket : [[ticket_id]] at [[date]]\r\n', '{\"ticket_id\":\"ticket_id\",\"name\":\"name\",\"date\":\"date\"}', 1, 1, 'en', '2021-12-17 10:00:26', '2022-06-13 22:21:42'),
(49, 1, 'USER_MAIL_OWN_TICKET_REPLY', 'support@mail.com', 'TICKET REPLY ', 'TICKET REPLY ', '[[name]] replied  ticket\r\nTicket : [[ticket_id]] at [[date]]\r\n', '[[name]] replied  ticket\r\nTicket : [[ticket_id]] at [[date]]\r\n', '{\"ticket_id\":\"ticket_id\",\"name\":\"name\",\"date\":\"date\"}', 1, 1, 'en', '2021-12-17 10:00:26', '2022-06-13 22:21:42'),
(50, 1, 'ADMIN_MAIL_USER_TICKET_CLOSE', 'support@mail.com', 'USER CLOSE TICKET', 'CLOSE TICKET', '[[name]] closed ticket\r\nTicket : [[ticket_id]] at [[date]]\r\n', '[[name]] closed ticket\r\nTicket : [[ticket_id]] at [[date]]\r\n', '{\"ticket_id\":\"ticket_id\",\"name\":\"name\",\"date\":\"date\"}', 1, 1, 'en', '2021-12-17 10:00:26', '2022-06-13 22:21:42'),
(51, 1, 'USER_MAIL_OWN_TICKET_CLOSE', 'support@mail.com', 'USER CLOSE TICKET', 'CLOSE TICKET', '[[name]] closed ticket\r\nTicket : [[ticket_id]] at [[date]]\r\n', '[[name]] closed ticket\r\nTicket : [[ticket_id]] at [[date]]\r\n', '{\"ticket_id\":\"ticket_id\",\"name\":\"name\",\"date\":\"date\"}', 1, 1, 'en', '2021-12-17 10:00:26', '2022-06-13 22:21:42'),
(52, 1, 'ADMIN_MAIL_OWN_SUPPORT_REPLY', 'support@mail.com', 'Admin reply ticket', 'Admin reply ticket', '[[name]] replied ticket\r\nTicket : [[ticket_id]] at [[date]]\r\n', '[[name]] replied ticket\r\nTicket : [[ticket_id]] at [[date]]\r\n', '{\"ticket_id\":\"ticket_id\",\"name\":\"name\",\"date\":\"date\"}', 1, 1, 'en', '2021-12-17 10:00:26', '2022-06-13 22:21:42'),
(53, 1, 'USER_MAIL_ADMIN_TICKET_REPLY', 'support@mail.com', 'Admin reply ticket', 'Admin reply ticket', '[[name]] replied ticket\r\nTicket : [[ticket_id]] at [[date]]\r\n', '[[name]] replied ticket\r\nTicket : [[ticket_id]] at [[date]]\r\n', '{\"ticket_id\":\"ticket_id\",\"name\":\"name\",\"date\":\"date\"}', 1, 1, 'en', '2021-12-17 10:00:26', '2022-06-13 22:21:42'),
(54, 1, 'ADMIN_MAIL_SUPPORT_TICKET_CLOSED', 'support@mail.com', 'Admin Closed ticket', 'Admin Closed Ticket', '[[name]] closed ticket\r\nTicket : [[ticket_id]] at [[date]]\r\n', '[[name]] closed ticket\r\nTicket : [[ticket_id]] at [[date]]\r\n', '{\"ticket_id\":\"ticket_id\",\"name\":\"name\",\"date\":\"date\"}', 1, 1, 'en', '2021-12-17 10:00:26', '2022-06-13 22:21:42'),
(55, 1, 'USER_MAIL_ADMIN_TICKET_CLOSED', 'support@mail.com', 'Admin Closed ticket', 'Admin Closed Ticket', '[[name]] closed ticket\r\nTicket : [[ticket_id]] at [[date]]\r\n', '[[name]] closed ticket\r\nTicket : [[ticket_id]] at [[date]]\r\n', '{\"ticket_id\":\"ticket_id\",\"name\":\"name\",\"date\":\"date\"}', 1, 1, 'en', '2021-12-17 10:00:26', '2022-06-13 22:21:42'),
(56, 1, 'USER_MAIL_KYC_APPROVED', 'support@mail.com', 'KYC APPROVED', 'KYC APPROVED', 'Your [[kyc_type]] has been apporved at [[date]]', 'Your [[kyc_type]] has been apporved at [[date]]', '{\"kyc_type\":\"kyc_type\",\"date\":\"date\"}', 1, 1, 'en', '2021-12-17 10:00:26', '2022-06-13 22:21:42'),
(57, 1, 'ADMIN_MAIL_KYC_REJECTED', 'support@mail.com', 'KYC REJECTED', 'KYC REJECTED', '[[user_name]] [[kyc_type]] has been rejected at [[date]]', '[[user_name]] [[kyc_type]] has been rejected at [[date]]', '{\"kyc_type\":\"kyc_type\",\"date\":\"date\",\"user_name\":\"user_name\"}', 1, 1, 'en', '2021-12-17 10:00:26', '2022-06-13 22:21:42'),
(58, 1, 'USER_MAIL_KYC_REJECTED', 'support@mail.com', 'KYC REJECTED', 'KYC REJECTED', 'Your [[kyc_type]] has been rejected at [[date]]', 'Your [[kyc_type]] has been rejected at [[date]]', '{\"kyc_type\":\"kyc_type\",\"date\":\"date\"}', 1, 1, 'en', '2021-12-17 10:00:26', '2022-06-13 22:21:42'),
(59, 1, 'USER_MAIL_PAYOUT_APPROVE', 'support@mail.com', 'Withdraw request has been approved', 'Withdraw request has been approved', '[[amount]] [[currency]] withdraw has been approved\r\n\r\nPayout Method [[method]]\r\nCharge [[charge]] [[currency]]\r\nTransaction [[transaction]]\r\n\r\nAdmin feedback [[feedback]] \r\n\r\nDate : [[date]]\r\n\r\n', '[[amount]] [[currency]] withdraw has been approved\r\n\r\nPayout Method [[method]]\r\nCharge [[charge]] [[currency]]\r\nTransaction [[transaction]]\r\n\r\nAdmin feedback [[feedback]] \r\n\r\nDate : [[date]]\r\n\r\n', '{\"method\":\"method\",\"amount\":\"amount\",\"charge\":\"charge\",\"currency\":\"currency\",\"transaction\":\"transaction\",\"feedback\":\"feedback\",\"date\":\"date\"}', 1, 1, 'en', '2021-12-17 10:00:26', '2022-06-13 22:21:42'),
(60, 1, 'USER_MAIL_PAYOUT_REJECTED', 'support@mail.com', 'Withdraw request has been rejected', 'Withdraw request has been rejected', '[[amount]] [[currency]] withdraw has been rejeced\r\n\r\nPayout Method [[method]]\r\nCharge [[charge]] [[currency]]\r\nTransaction [[transaction]]\r\n\r\nAdmin feedback [[feedback]]\r\n\r\nDate: [[date]]\r\n\r\n', '[[amount]] [[currency]] withdraw has been rejeced\r\n\r\nPayout Method [[method]]\r\nCharge [[charge]] [[currency]]\r\nTransaction [[transaction]]\r\n\r\nAdmin feedback [[feedback]]\r\n\r\nDate: [[date]]\r\n\r\n', '{\"method\":\"method\",\"amount\":\"amount\",\"charge\":\"charge\",\"currency\":\"currency\",\"transaction\":\"transaction\",\"feedback\":\"feedback\",\"date\":\"date\"}', 1, 1, 'en', '2021-12-17 10:00:26', '2022-06-13 22:21:42'),
(61, 1, 'ADMIN_MAIL_WHEN_ADMIN_USER_UPDATE', 'support@mail.com', 'admin user profile information updated', 'admin user profile information updated', '[[user_name]] profile updated at [[date]]\r\n', '[[user_name]] profile updated at [[date]]\r\n', '{\"user_name\":\"user_name\",\"date\":\"date\"}', 1, 1, 'en', '2021-12-17 10:00:26', '2022-06-13 22:21:42'),
(62, 1, 'USER_MAIL_WHEN_ADMIN_PROFILE_UPDATE', 'support@mail.com', 'profile information updated', 'profile information updated', 'admin your profile information updated\r\n', 'admin your profile information updated\r\n', '{\"user_name\":\"user_name\",\"date\":\"date\"}', 1, 1, 'en', '2021-12-17 10:00:26', '2022-06-13 22:21:42'),
(63, 1, 'BADGE_MAIL_TO_USER', 'support@mail.com', 'BADGE MAIL TO USER', 'Badge Acheived', '[[user]] Acheived [[badge]] at [[date]]\r\n', '[[user]] Acheived [[badge]] at [[date]]\r\n', '{\"user\":\"user\",\"badge\":\"badge\",\"date\":\"date\"}', 1, 1, 'en', '2021-12-17 10:00:26', '2022-06-13 22:21:42'),
(64, 1, 'BADGE_MAIL_TO_ADMIN', 'support@mail.com', 'BADGE MAIL TO ADMIN', 'Badge Acheived', '[[user]] Acheived [[badge]] at [[date]]\r\n', '[[user]] Acheived [[badge]] at [[date]]\r\n', '{\"user\":\"user\",\"badge\":\"badge\",\"date\":\"date\"}', 1, 1, 'en', '2021-12-17 10:00:26', '2022-06-13 22:21:42');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` int(11) UNSIGNED NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `funds`
--

CREATE TABLE `funds` (
  `id` int(11) UNSIGNED NOT NULL,
  `user_id` int(11) UNSIGNED DEFAULT NULL,
  `gateway_id` int(11) UNSIGNED DEFAULT NULL,
  `plan_id` int(11) DEFAULT NULL,
  `gateway_currency` varchar(191) DEFAULT NULL,
  `amount` decimal(18,8) NOT NULL DEFAULT 0.00000000,
  `charge` decimal(18,8) NOT NULL DEFAULT 0.00000000,
  `rate` decimal(18,8) NOT NULL DEFAULT 0.00000000,
  `final_amount` decimal(18,8) NOT NULL DEFAULT 0.00000000,
  `btc_amount` decimal(18,8) DEFAULT NULL,
  `btc_wallet` varchar(191) DEFAULT NULL,
  `transaction` varchar(25) DEFAULT NULL,
  `try` int(11) DEFAULT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 0 COMMENT '1=> Complete, 2=> Pending, 3 => Cancel',
  `detail` text DEFAULT NULL,
  `feedback` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `payment_id` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `gateways`
--

CREATE TABLE `gateways` (
  `id` int(11) UNSIGNED NOT NULL,
  `name` varchar(191) NOT NULL,
  `code` varchar(191) NOT NULL,
  `currency` varchar(191) NOT NULL,
  `symbol` varchar(191) NOT NULL,
  `parameters` text DEFAULT NULL,
  `extra_parameters` text DEFAULT NULL,
  `convention_rate` decimal(18,8) NOT NULL DEFAULT 1.00000000,
  `currencies` text DEFAULT NULL,
  `min_amount` decimal(18,8) NOT NULL,
  `max_amount` decimal(18,8) NOT NULL,
  `percentage_charge` decimal(8,4) NOT NULL DEFAULT 0.0000,
  `fixed_charge` decimal(18,8) NOT NULL DEFAULT 0.00000000,
  `status` tinyint(1) NOT NULL DEFAULT 1 COMMENT '0: inactive, 1: active',
  `note` text DEFAULT NULL,
  `image` varchar(191) DEFAULT NULL,
  `sort_by` int(11) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `gateways`
--

INSERT INTO `gateways` (`id`, `name`, `code`, `currency`, `symbol`, `parameters`, `extra_parameters`, `convention_rate`, `currencies`, `min_amount`, `max_amount`, `percentage_charge`, `fixed_charge`, `status`, `note`, `image`, `sort_by`, `created_at`, `updated_at`) VALUES
(1, 'Paypal', 'paypal', 'USD', 'USD', '{\"cleint_id\":\"\",\"secret\":\"\"}', NULL, '0.01200000', '{\"0\":{\"AUD\":\"AUD\",\"BRL\":\"BRL\",\"CAD\":\"CAD\",\"CZK\":\"CZK\",\"DKK\":\"DKK\",\"EUR\":\"EUR\",\"HKD\":\"HKD\",\"HUF\":\"HUF\",\"INR\":\"INR\",\"ILS\":\"ILS\",\"JPY\":\"JPY\",\"MYR\":\"MYR\",\"MXN\":\"MXN\",\"TWD\":\"TWD\",\"NZD\":\"NZD\",\"NOK\":\"NOK\",\"PHP\":\"PHP\",\"PLN\":\"PLN\",\"GBP\":\"GBP\",\"RUB\":\"RUB\",\"SGD\":\"SGD\",\"SEK\":\"SEK\",\"CHF\":\"CHF\",\"THB\":\"THB\",\"USD\":\"USD\"}}', '1.00000000', '10000.00000000', '1.0000', '0.50000000', 1, '', '5f637b5622d23.jpg', 15, '2020-09-10 09:05:02', '2023-01-29 01:40:33'),
(2, 'Stripe ', 'stripe', 'USD', 'USD', '{\"secret_key\":\"\",\"publishable_key\":\"\"}', NULL, '1.00000000', '{\"0\":{\"USD\":\"USD\",\"AUD\":\"AUD\",\"BRL\":\"BRL\",\"CAD\":\"CAD\",\"CHF\":\"CHF\",\"DKK\":\"DKK\",\"EUR\":\"EUR\",\"GBP\":\"GBP\",\"HKD\":\"HKD\",\"INR\":\"INR\",\"JPY\":\"JPY\",\"MXN\":\"MXN\",\"MYR\":\"MYR\",\"NOK\":\"NOK\",\"NZD\":\"NZD\",\"PLN\":\"PLN\",\"SEK\":\"SEK\",\"SGD\":\"SGD\"}}', '1.00000000', '10000.00000000', '0.0000', '0.50000000', 1, '', '5f645d432b9c0.jpg', 30, '2020-09-10 09:05:02', '2023-01-29 01:40:33'),
(3, 'Skrill', 'skrill', 'USD', 'USD', '{\"pay_to_email\":\"\",\"secret_key\":\"\"}', NULL, '1.00000000', '{\"0\":{\"AED\":\"AED\",\"AUD\":\"AUD\",\"BGN\":\"BGN\",\"BHD\":\"BHD\",\"CAD\":\"CAD\",\"CHF\":\"CHF\",\"CZK\":\"CZK\",\"DKK\":\"DKK\",\"EUR\":\"EUR\",\"GBP\":\"GBP\",\"HKD\":\"HKD\",\"HRK\":\"HRK\",\"HUF\":\"HUF\",\"ILS\":\"ILS\",\"INR\":\"INR\",\"ISK\":\"ISK\",\"JOD\":\"JOD\",\"JPY\":\"JPY\",\"KRW\":\"KRW\",\"KWD\":\"KWD\",\"MAD\":\"MAD\",\"MYR\":\"MYR\",\"NOK\":\"NOK\",\"NZD\":\"NZD\",\"OMR\":\"OMR\",\"PLN\":\"PLN\",\"QAR\":\"QAR\",\"RON\":\"RON\",\"RSD\":\"RSD\",\"SAR\":\"SAR\",\"SEK\":\"SEK\",\"SGD\":\"SGD\",\"THB\":\"THB\",\"TND\":\"TND\",\"TRY\":\"TRY\",\"TWD\":\"TWD\",\"USD\":\"USD\",\"ZAR\":\"ZAR\",\"COP\":\"COP\"}}', '1.00000000', '10000.00000000', '0.0000', '0.50000000', 1, '', '5f637c7fcb9ef.jpg', 31, '2020-09-10 09:05:02', '2023-01-29 01:40:33'),
(4, 'Perfect Money', 'perfectmoney', 'USD', 'USD', '{\"passphrase\":\"\",\"payee_account\":\"\"}', NULL, '1.00000000', '{\"0\":{\"USD\":\"USD\",\"EUR\":\"EUR\"}}', '1.00000000', '10000.00000000', '0.0000', '0.50000000', 1, '', '5f64d522d8bea.jpg', 26, '2020-09-10 09:05:02', '2023-01-29 01:40:33'),
(5, 'PayTM', 'paytm', 'INR', 'INR', '{\"MID\":\"\",\"merchant_key\":\"\",\"WEBSITE\":\"\",\"INDUSTRY_TYPE_ID\":\"\",\"CHANNEL_ID\":\"\",\"transaction_url\":\"\",\"transaction_status_url\":\"\"}', NULL, '1.00000000', '{\"0\":{\"AUD\":\"AUD\",\"ARS\":\"ARS\",\"BDT\":\"BDT\",\"BRL\":\"BRL\",\"BGN\":\"BGN\",\"CAD\":\"CAD\",\"CLP\":\"CLP\",\"CNY\":\"CNY\",\"COP\":\"COP\",\"HRK\":\"HRK\",\"CZK\":\"CZK\",\"DKK\":\"DKK\",\"EGP\":\"EGP\",\"EUR\":\"EUR\",\"GEL\":\"GEL\",\"GHS\":\"GHS\",\"HKD\":\"HKD\",\"HUF\":\"HUF\",\"INR\":\"INR\",\"IDR\":\"IDR\",\"ILS\":\"ILS\",\"JPY\":\"JPY\",\"KES\":\"KES\",\"MYR\":\"MYR\",\"MXN\":\"MXN\",\"MAD\":\"MAD\",\"NPR\":\"NPR\",\"NZD\":\"NZD\",\"NGN\":\"NGN\",\"NOK\":\"NOK\",\"PKR\":\"PKR\",\"PEN\":\"PEN\",\"PHP\":\"PHP\",\"PLN\":\"PLN\",\"RON\":\"RON\",\"RUB\":\"RUB\",\"SGD\":\"SGD\",\"ZAR\":\"ZAR\",\"KRW\":\"KRW\",\"LKR\":\"LKR\",\"SEK\":\"SEK\",\"CHF\":\"CHF\",\"THB\":\"THB\",\"TRY\":\"TRY\",\"UGX\":\"UGX\",\"UAH\":\"UAH\",\"AED\":\"AED\",\"GBP\":\"GBP\",\"USD\":\"USD\",\"VND\":\"VND\",\"XOF\":\"XOF\"}}', '1.00000000', '10000.00000000', '0.0000', '0.50000000', 1, '', '5f637cbfb4d4c.jpg', 24, '2020-09-10 09:05:02', '2023-01-29 01:40:33'),
(6, 'Payeer', 'payeer', 'RUB', 'USD', '{\"merchant_id\":\"\",\"secret_key\":\"\"}', '{\"status\":\"ipn\"}', '1.00000000', '{\"0\":{\"USD\":\"USD\",\"EUR\":\"EUR\",\"RUB\":\"RUB\"}}', '1.00000000', '10000.00000000', '0.0000', '0.50000000', 1, '', '5f64d52d09e13.jpg', 22, '2020-09-10 09:05:02', '2023-01-29 01:40:33'),
(7, 'PayStack', 'paystack', 'NGN', 'NGN', '{\"public_key\":\"\",\"secret_key\":\"\"}', '{\"callback\":\"ipn\",\"webhook\":\"ipn\"}\r\n', '1.00000000', '{\"0\":{\"USD\":\"USD\",\"NGN\":\"NGN\"}}', '1.00000000', '10000.00000000', '0.0000', '0.50000000', 1, '', '5f637d069177e.jpg', 23, '2020-09-10 09:05:02', '2023-01-29 01:40:33'),
(8, 'VoguePay', 'voguepay', 'USD', 'USD', '{\"merchant_id\":\"\"}', NULL, '1.00000000', '{\"0\":{\"NGN\":\"NGN\",\"USD\":\"USD\",\"EUR\":\"EUR\",\"GBP\":\"GBP\",\"ZAR\":\"ZAR\",\"JPY\":\"JPY\",\"INR\":\"INR\",\"AUD\":\"AUD\",\"CAD\":\"CAD\",\"NZD\":\"NZD\",\"NOK\":\"NOK\",\"PLN\":\"PLN\"}}\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n', '1.00000000', '10000.00000000', '0.0000', '0.50000000', 1, '', '5f637d53da3e7.jpg', 29, '2020-09-10 09:05:02', '2023-01-29 01:40:33'),
(9, 'Flutterwave', 'flutterwave', 'USD', 'USD', '{\"public_key\":\"\",\"secret_key\":\"\",\"encryption_key\":\"\"}', NULL, '0.01200000', '{\"0\":{\"KES\":\"KES\",\"GHS\":\"GHS\",\"NGN\":\"NGN\",\"USD\":\"USD\",\"GBP\":\"GBP\",\"EUR\":\"EUR\",\"UGX\":\"UGX\",\"TZS\":\"TZS\"}}', '1.00000000', '10000.00000000', '0.0000', '0.50000000', 1, '', '5f637d6a0b22d.jpg', 13, '2020-09-10 09:05:02', '2023-01-29 01:40:33'),
(10, 'RazorPay', 'razorpay', 'INR', 'INR', '{\"key_id\":\"\",\"key_secret\":\"\"}', NULL, '1.00000000', '{\"0\": {\"INR\": \"INR\"}}', '1.00000000', '10000.00000000', '0.0000', '0.50000000', 1, '', '5f637d80b68e0.jpg', 27, '2020-09-10 09:05:02', '2023-01-29 01:40:33'),
(11, 'instamojo', 'instamojo', 'INR', 'INR', '{\"api_key\":\"\",\"auth_token\":\"\",\"salt\":\"\"}', NULL, '73.51000000', '{\"0\":{\"INR\":\"INR\"}}', '1.00000000', '10000.00000000', '0.0000', '0.50000000', 1, '', '5f637da3c44d2.jpg', 14, '2020-09-10 09:05:02', '2023-01-29 01:40:33'),
(12, 'Mollie', 'mollie', 'USD', 'USD', '{\"api_key\":\"\"}', NULL, '0.01200000', '{\"0\":{\"AED\":\"AED\",\"AUD\":\"AUD\",\"BGN\":\"BGN\",\"BRL\":\"BRL\",\"CAD\":\"CAD\",\"CHF\":\"CHF\",\"CZK\":\"CZK\",\"DKK\":\"DKK\",\"EUR\":\"EUR\",\"GBP\":\"GBP\",\"HKD\":\"HKD\",\"HRK\":\"HRK\",\"HUF\":\"HUF\",\"ILS\":\"ILS\",\"ISK\":\"ISK\",\"JPY\":\"JPY\",\"MXN\":\"MXN\",\"MYR\":\"MYR\",\"NOK\":\"NOK\",\"NZD\":\"NZD\",\"PHP\":\"PHP\",\"PLN\":\"PLN\",\"RON\":\"RON\",\"RUB\":\"RUB\",\"SEK\":\"SEK\",\"SGD\":\"SGD\",\"THB\":\"THB\",\"TWD\":\"TWD\",\"USD\":\"USD\",\"ZAR\":\"ZAR\"}}', '1.00000000', '10000.00000000', '0.0000', '0.50000000', 1, '', '5f637db537958.jpg', 20, '2020-09-10 09:05:02', '2023-01-29 01:40:33'),
(13, '2checkout', 'twocheckout', 'USD', 'USD', '{\"merchant_code\":\"\",\"secret_key\":\"\"}', '{\"approved_url\":\"ipn\"}', '1.00000000', '{\"0\":{\"AFN\":\"AFN\",\"ALL\":\"ALL\",\"DZD\":\"DZD\",\"ARS\":\"ARS\",\"AUD\":\"AUD\",\"AZN\":\"AZN\",\"BSD\":\"BSD\",\"BDT\":\"BDT\",\"BBD\":\"BBD\",\"BZD\":\"BZD\",\"BMD\":\"BMD\",\"BOB\":\"BOB\",\"BWP\":\"BWP\",\"BRL\":\"BRL\",\"GBP\":\"GBP\",\"BND\":\"BND\",\"BGN\":\"BGN\",\"CAD\":\"CAD\",\"CLP\":\"CLP\",\"CNY\":\"CNY\",\"COP\":\"COP\",\"CRC\":\"CRC\",\"HRK\":\"HRK\",\"CZK\":\"CZK\",\"DKK\":\"DKK\",\"DOP\":\"DOP\",\"XCD\":\"XCD\",\"EGP\":\"EGP\",\"EUR\":\"EUR\",\"FJD\":\"FJD\",\"GTQ\":\"GTQ\",\"HKD\":\"HKD\",\"HNL\":\"HNL\",\"HUF\":\"HUF\",\"INR\":\"INR\",\"IDR\":\"IDR\",\"ILS\":\"ILS\",\"JMD\":\"JMD\",\"JPY\":\"JPY\",\"KZT\":\"KZT\",\"KES\":\"KES\",\"LAK\":\"LAK\",\"MMK\":\"MMK\",\"LBP\":\"LBP\",\"LRD\":\"LRD\",\"MOP\":\"MOP\",\"MYR\":\"MYR\",\"MVR\":\"MVR\",\"MRO\":\"MRO\",\"MUR\":\"MUR\",\"MXN\":\"MXN\",\"MAD\":\"MAD\",\"NPR\":\"NPR\",\"TWD\":\"TWD\",\"NZD\":\"NZD\",\"NIO\":\"NIO\",\"NOK\":\"NOK\",\"PKR\":\"PKR\",\"PGK\":\"PGK\",\"PEN\":\"PEN\",\"PHP\":\"PHP\",\"PLN\":\"PLN\",\"QAR\":\"QAR\",\"RON\":\"RON\",\"RUB\":\"RUB\",\"WST\":\"WST\",\"SAR\":\"SAR\",\"SCR\":\"SCR\",\"SGD\":\"SGD\",\"SBD\":\"SBD\",\"ZAR\":\"ZAR\",\"KRW\":\"KRW\",\"LKR\":\"LKR\",\"SEK\":\"SEK\",\"CHF\":\"CHF\",\"SYP\":\"SYP\",\"THB\":\"THB\",\"TOP\":\"TOP\",\"TTD\":\"TTD\",\"TRY\":\"TRY\",\"UAH\":\"UAH\",\"AED\":\"AED\",\"USD\":\"USD\",\"VUV\":\"VUV\",\"VND\":\"VND\",\"XOF\":\"XOF\",\"YER\":\"YER\"}}', '1.00000000', '10000.00000000', '0.0000', '0.50000000', 1, '', '5f637e7eae68b.jpg', 32, '2020-09-10 09:05:02', '2023-01-29 01:40:33'),
(14, 'Authorize.Net', 'authorizenet', 'USD', 'USD', '{\"login_id\":\"\",\"current_transaction_key\":\"\"}', NULL, '0.01200000', '{\"0\":{\"AUD\":\"AUD\",\"CAD\":\"CAD\",\"CHF\":\"CHF\",\"DKK\":\"DKK\",\"EUR\":\"EUR\",\"GBP\":\"GBP\",\"NOK\":\"NOK\",\"NZD\":\"NZD\",\"PLN\":\"PLN\",\"SEK\":\"SEK\",\"USD\":\"USD\"}}', '1.00000000', '10000.00000000', '0.0000', '0.50000000', 1, '', '5f637de6d9fef.jpg', 6, '2020-09-10 09:05:02', '2023-01-29 01:40:33'),
(15, 'SecurionPay', 'securionpay', 'USD', 'USD', '{\"public_key\":\"\",\"secret_key\":\"\"}', NULL, '1.00000000', '{\"0\":{\"AFN\":\"AFN\", \"DZD\":\"DZD\", \"ARS\":\"ARS\", \"AUD\":\"AUD\", \"BHD\":\"BHD\", \"BDT\":\"BDT\", \"BYR\":\"BYR\", \"BAM\":\"BAM\", \"BWP\":\"BWP\", \"BRL\":\"BRL\", \"BND\":\"BND\", \"BGN\":\"BGN\", \"CAD\":\"CAD\", \"CLP\":\"CLP\", \"CNY\":\"CNY\", \"COP\":\"COP\", \"KMF\":\"KMF\", \"HRK\":\"HRK\", \"CZK\":\"CZK\", \"DKK\":\"DKK\", \"DJF\":\"DJF\", \"DOP\":\"DOP\", \"EGP\":\"EGP\", \"ETB\":\"ETB\", \"ERN\":\"ERN\", \"EUR\":\"EUR\", \"GEL\":\"GEL\", \"HKD\":\"HKD\", \"HUF\":\"HUF\", \"ISK\":\"ISK\", \"INR\":\"INR\", \"IDR\":\"IDR\", \"IRR\":\"IRR\", \"IQD\":\"IQD\", \"ILS\":\"ILS\", \"JMD\":\"JMD\", \"JPY\":\"JPY\", \"JOD\":\"JOD\", \"KZT\":\"KZT\", \"KES\":\"KES\", \"KWD\":\"KWD\", \"KGS\":\"KGS\", \"LVL\":\"LVL\", \"LBP\":\"LBP\", \"LTL\":\"LTL\", \"MOP\":\"MOP\", \"MKD\":\"MKD\", \"MGA\":\"MGA\", \"MWK\":\"MWK\", \"MYR\":\"MYR\", \"MUR\":\"MUR\", \"MXN\":\"MXN\", \"MDL\":\"MDL\", \"MAD\":\"MAD\", \"MZN\":\"MZN\", \"NAD\":\"NAD\", \"NPR\":\"NPR\", \"ANG\":\"ANG\", \"NZD\":\"NZD\", \"NOK\":\"NOK\", \"OMR\":\"OMR\", \"PKR\":\"PKR\", \"PEN\":\"PEN\", \"PHP\":\"PHP\", \"PLN\":\"PLN\", \"QAR\":\"QAR\", \"RON\":\"RON\", \"RUB\":\"RUB\", \"SAR\":\"SAR\", \"RSD\":\"RSD\", \"SGD\":\"SGD\", \"ZAR\":\"ZAR\", \"KRW\":\"KRW\", \"IKR\":\"IKR\", \"LKR\":\"LKR\", \"SEK\":\"SEK\", \"CHF\":\"CHF\", \"SYP\":\"SYP\", \"TWD\":\"TWD\", \"TZS\":\"TZS\", \"THB\":\"THB\", \"TND\":\"TND\", \"TRY\":\"TRY\", \"UAH\":\"UAH\", \"AED\":\"AED\", \"GBP\":\"GBP\", \"USD\":\"USD\", \"VEB\":\"VEB\", \"VEF\":\"VEF\", \"VND\":\"VND\", \"XOF\":\"XOF\", \"YER\":\"YER\", \"ZMK\":\"ZMK\"}}', '1.00000000', '10000.00000000', '0.0000', '0.50000000', 1, '', '5f637e002d11b.jpg', 28, '2020-09-10 09:05:02', '2023-01-29 01:40:33'),
(16, 'PayUmoney', 'payumoney', 'INR', 'INR', '{\"merchant_key\":\"\",\"salt\":\"\"}', NULL, '0.87000000', '{\"0\":{\"INR\":\"INR\"}}', '1.00000000', '10000.00000000', '0.0000', '0.50000000', 1, '', '5f6390dbaa6ff.jpg', 25, '2020-09-10 09:05:02', '2023-01-29 01:40:33'),
(17, 'Mercado Pago', 'mercadopago', 'BRL', 'BRL', '{\"access_token\":\"\"}', NULL, '0.06300000', '{\"0\":{\"ARS\":\"ARS\",\"BOB\":\"BOB\",\"BRL\":\"BRL\",\"CLF\":\"CLF\",\"CLP\":\"CLP\",\"COP\":\"COP\",\"CRC\":\"CRC\",\"CUC\":\"CUC\",\"CUP\":\"CUP\",\"DOP\":\"DOP\",\"EUR\":\"EUR\",\"GTQ\":\"GTQ\",\"HNL\":\"HNL\",\"MXN\":\"MXN\",\"NIO\":\"NIO\",\"PAB\":\"PAB\",\"PEN\":\"PEN\",\"PYG\":\"PYG\",\"USD\":\"USD\",\"UYU\":\"UYU\",\"VEF\":\"VEF\",\"VES\":\"VES\"}}', '3715.12000000', '371500000.12000000', '0.0000', '0.50000000', 1, '', '5f645d1bc1f24.jpg', 19, '2020-09-10 09:05:02', '2023-01-29 01:40:33'),
(18, 'Coingate', 'coingate', 'USD', 'USD', '{\"api_key\":\"\"}', NULL, '1.00000000', '{\"0\":{\"USD\":\"USD\",\"EUR\":\"EUR\"}}', '1.00000000', '10000.00000000', '0.0000', '0.50000000', 1, '', '5f659e5355859.jpg', 16, '2020-09-10 09:05:02', '2023-01-29 01:40:33'),
(19, 'Coinbase Commerce', 'coinbasecommerce', 'USD', 'USD', '{\"api_key\":\"\",\"secret\":\"\"}', '{\"webhook\":\"ipn\"}', '1.00000000', '{\"0\":{\"AED\":\"AED\",\"AFN\":\"AFN\",\"ALL\":\"ALL\",\"AMD\":\"AMD\",\"ANG\":\"ANG\",\"AOA\":\"AOA\",\"ARS\":\"ARS\",\"AUD\":\"AUD\",\"AWG\":\"AWG\",\"AZN\":\"AZN\",\"BAM\":\"BAM\",\"BBD\":\"BBD\",\"BDT\":\"BDT\",\"BGN\":\"BGN\",\"BHD\":\"BHD\",\"BIF\":\"BIF\",\"BMD\":\"BMD\",\"BND\":\"BND\",\"BOB\":\"BOB\",\"BRL\":\"BRL\",\"BSD\":\"BSD\",\"BTN\":\"BTN\",\"BWP\":\"BWP\",\"BYN\":\"BYN\",\"BZD\":\"BZD\",\"CAD\":\"CAD\",\"CDF\":\"CDF\",\"CHF\":\"CHF\",\"CLF\":\"CLF\",\"CLP\":\"CLP\",\"CNY\":\"CNY\",\"COP\":\"COP\",\"CRC\":\"CRC\",\"CUC\":\"CUC\",\"CUP\":\"CUP\",\"CVE\":\"CVE\",\"CZK\":\"CZK\",\"DJF\":\"DJF\",\"DKK\":\"DKK\",\"DOP\":\"DOP\",\"DZD\":\"DZD\",\"EGP\":\"EGP\",\"ERN\":\"ERN\",\"ETB\":\"ETB\",\"EUR\":\"EUR\",\"FJD\":\"FJD\",\"FKP\":\"FKP\",\"GBP\":\"GBP\",\"GEL\":\"GEL\",\"GGP\":\"GGP\",\"GHS\":\"GHS\",\"GIP\":\"GIP\",\"GMD\":\"GMD\",\"GNF\":\"GNF\",\"GTQ\":\"GTQ\",\"GYD\":\"GYD\",\"HKD\":\"HKD\",\"HNL\":\"HNL\",\"HRK\":\"HRK\",\"HTG\":\"HTG\",\"HUF\":\"HUF\",\"IDR\":\"IDR\",\"ILS\":\"ILS\",\"IMP\":\"IMP\",\"INR\":\"INR\",\"IQD\":\"IQD\",\"IRR\":\"IRR\",\"ISK\":\"ISK\",\"JEP\":\"JEP\",\"JMD\":\"JMD\",\"JOD\":\"JOD\",\"JPY\":\"JPY\",\"KES\":\"KES\",\"KGS\":\"KGS\",\"KHR\":\"KHR\",\"KMF\":\"KMF\",\"KPW\":\"KPW\",\"KRW\":\"KRW\",\"KWD\":\"KWD\",\"KYD\":\"KYD\",\"KZT\":\"KZT\",\"LAK\":\"LAK\",\"LBP\":\"LBP\",\"LKR\":\"LKR\",\"LRD\":\"LRD\",\"LSL\":\"LSL\",\"LYD\":\"LYD\",\"MAD\":\"MAD\",\"MDL\":\"MDL\",\"MGA\":\"MGA\",\"MKD\":\"MKD\",\"MMK\":\"MMK\",\"MNT\":\"MNT\",\"MOP\":\"MOP\",\"MRO\":\"MRO\",\"MUR\":\"MUR\",\"MVR\":\"MVR\",\"MWK\":\"MWK\",\"MXN\":\"MXN\",\"MYR\":\"MYR\",\"MZN\":\"MZN\",\"NAD\":\"NAD\",\"NGN\":\"NGN\",\"NIO\":\"NIO\",\"NOK\":\"NOK\",\"NPR\":\"NPR\",\"NZD\":\"NZD\",\"OMR\":\"OMR\",\"PAB\":\"PAB\",\"PEN\":\"PEN\",\"PGK\":\"PGK\",\"PHP\":\"PHP\",\"PKR\":\"PKR\",\"PLN\":\"PLN\",\"PYG\":\"PYG\",\"QAR\":\"QAR\",\"RON\":\"RON\",\"RSD\":\"RSD\",\"RUB\":\"RUB\",\"RWF\":\"RWF\",\"SAR\":\"SAR\",\"SBD\":\"SBD\",\"SCR\":\"SCR\",\"SDG\":\"SDG\",\"SEK\":\"SEK\",\"SGD\":\"SGD\",\"SHP\":\"SHP\",\"SLL\":\"SLL\",\"SOS\":\"SOS\",\"SRD\":\"SRD\",\"SSP\":\"SSP\",\"STD\":\"STD\",\"SVC\":\"SVC\",\"SYP\":\"SYP\",\"SZL\":\"SZL\",\"THB\":\"THB\",\"TJS\":\"TJS\",\"TMT\":\"TMT\",\"TND\":\"TND\",\"TOP\":\"TOP\",\"TRY\":\"TRY\",\"TTD\":\"TTD\",\"TWD\":\"TWD\",\"TZS\":\"TZS\",\"UAH\":\"UAH\",\"UGX\":\"UGX\",\"USD\":\"USD\",\"UYU\":\"UYU\",\"UZS\":\"UZS\",\"VEF\":\"VEF\",\"VND\":\"VND\",\"VUV\":\"VUV\",\"WST\":\"WST\",\"XAF\":\"XAF\",\"XAG\":\"XAG\",\"XAU\":\"XAU\",\"XCD\":\"XCD\",\"XDR\":\"XDR\",\"XOF\":\"XOF\",\"XPD\":\"XPD\",\"XPF\":\"XPF\",\"XPT\":\"XPT\",\"YER\":\"YER\",\"ZAR\":\"ZAR\",\"ZMW\":\"ZMW\",\"ZWL\":\"ZWL\"}}', '1.00000000', '10000.00000000', '0.0000', '0.50000000', 1, '', '5f6703145a5ca.jpg', 18, '2020-09-10 09:05:02', '2023-01-29 01:40:33'),
(20, 'Monnify', 'monnify', 'NGN', 'NGN', '{\"api_key\":\"\",\"secret_key\":\"\",\"contract_code\":\"\"}', NULL, '4.52000000', '{\"0\":{\"NGN\":\"NGN\"}}', '1.00000000', '10000.00000000', '0.0000', '0.50000000', 1, '', '5fbca5d05057f.jpg', 21, '2020-09-10 09:05:02', '2023-01-29 01:40:33'),
(21, 'Block.io', 'blockio', 'BTC', 'BTC', '{\"api_key\":\"\",\"api_pin\":\"\"}', '{\"cron\":\"ipn\"}', '0.00004200', '{\"1\":{\"BTC\":\"BTC\",\"LTC\":\"LTC\",\"DOGE\":\"DOGE\"}}', '10.10004200', '10000.00000000', '0.0000', '0.50000000', 1, '', '5fe038332ad52.jpg', 2, '2020-09-10 09:05:02', '2023-01-29 01:40:33'),
(22, 'CoinPayments', 'coinpayments', 'BTC', 'BTC', '{\"merchant_id\":\"\",\"private_key\":\"\",\"public_key\":\"\"}', '{\"callback\":\"ipn\"}', '0.00000000', '{\"0\":{\"USD\":\"USD\",\"AUD\":\"AUD\",\"BRL\":\"BRL\",\"CAD\":\"CAD\",\"CHF\":\"CHF\",\"CLP\":\"CLP\",\"CNY\":\"CNY\",\"DKK\":\"DKK\",\"EUR\":\"EUR\",\"GBP\":\"GBP\",\"HKD\":\"HKD\",\"INR\":\"INR\",\"ISK\":\"ISK\",\"JPY\":\"JPY\",\"KRW\":\"KRW\",\"NZD\":\"NZD\",\"PLN\":\"PLN\",\"RUB\":\"RUB\",\"SEK\":\"SEK\",\"SGD\":\"SGD\",\"THB\":\"THB\",\"TWD\":\"TWD\"},\"1\":{\"BTC\":\"Bitcoin\",\"BTC.LN\":\"Bitcoin (Lightning Network)\",\"LTC\":\"Litecoin\",\"CPS\":\"CPS Coin\",\"VLX\":\"Velas\",\"APL\":\"Apollo\",\"AYA\":\"Aryacoin\",\"BAD\":\"Badcoin\",\"BCD\":\"Bitcoin Diamond\",\"BCH\":\"Bitcoin Cash\",\"BCN\":\"Bytecoin\",\"BEAM\":\"BEAM\",\"BITB\":\"Bean Cash\",\"BLK\":\"BlackCoin\",\"BSV\":\"Bitcoin SV\",\"BTAD\":\"Bitcoin Adult\",\"BTG\":\"Bitcoin Gold\",\"BTT\":\"BitTorrent\",\"CLOAK\":\"CloakCoin\",\"CLUB\":\"ClubCoin\",\"CRW\":\"Crown\",\"CRYP\":\"CrypticCoin\",\"CRYT\":\"CryTrExCoin\",\"CURE\":\"CureCoin\",\"DASH\":\"DASH\",\"DCR\":\"Decred\",\"DEV\":\"DeviantCoin\",\"DGB\":\"DigiByte\",\"DOGE\":\"Dogecoin\",\"EBST\":\"eBoost\",\"EOS\":\"EOS\",\"ETC\":\"Ether Classic\",\"ETH\":\"Ethereum\",\"ETN\":\"Electroneum\",\"EUNO\":\"EUNO\",\"EXP\":\"EXP\",\"Expanse\":\"Expanse\",\"FLASH\":\"FLASH\",\"GAME\":\"GameCredits\",\"GLC\":\"Goldcoin\",\"GRS\":\"Groestlcoin\",\"KMD\":\"Komodo\",\"LOKI\":\"LOKI\",\"LSK\":\"LSK\",\"MAID\":\"MaidSafeCoin\",\"MUE\":\"MonetaryUnit\",\"NAV\":\"NAV Coin\",\"NEO\":\"NEO\",\"NMC\":\"Namecoin\",\"NVST\":\"NVO Token\",\"NXT\":\"NXT\",\"OMNI\":\"OMNI\",\"PINK\":\"PinkCoin\",\"PIVX\":\"PIVX\",\"POT\":\"PotCoin\",\"PPC\":\"Peercoin\",\"PROC\":\"ProCurrency\",\"PURA\":\"PURA\",\"QTUM\":\"QTUM\",\"RES\":\"Resistance\",\"RVN\":\"Ravencoin\",\"RVR\":\"RevolutionVR\",\"SBD\":\"Steem Dollars\",\"SMART\":\"SmartCash\",\"SOXAX\":\"SOXAX\",\"STEEM\":\"STEEM\",\"STRAT\":\"STRAT\",\"SYS\":\"Syscoin\",\"TPAY\":\"TokenPay\",\"TRIGGERS\":\"Triggers\",\"TRX\":\" TRON\",\"UBQ\":\"Ubiq\",\"UNIT\":\"UniversalCurrency\",\"USDT\":\"Tether USD (Omni Layer)\",\"VTC\":\"Vertcoin\",\"WAVES\":\"Waves\",\"XCP\":\"Counterparty\",\"XEM\":\"NEM\",\"XMR\":\"Monero\",\"XSN\":\"Stakenet\",\"XSR\":\"SucreCoin\",\"XVG\":\"VERGE\",\"XZC\":\"ZCoin\",\"ZEC\":\"ZCash\",\"ZEN\":\"Horizen\"}}', '10.00000000', '99999.00000000', '1.0000', '0.50000000', 1, '', '5ffd7d962985e1610448278.jpg', 17, '2020-09-10 09:05:02', '2023-01-29 01:40:33'),
(23, 'Blockchain', 'blockchain', 'BTC', 'BTC', '{\"api_key\":\"\",\"xpub_code\":\"\"}', NULL, '0.00000000', '{\"1\":{\"BTC\":\"BTC\"}}', '100.00000000', '10000.00000000', '0.0000', '0.50000000', 1, '', '5fe439f477bb7.jpg', 1, '2020-09-10 09:05:02', '2023-01-29 01:40:33'),
(24, 'Midtrans', 'midtrans', 'IDR', 'IDR', '{\"client_key\":\"\",\"server_key\":\"\"}', '{\"payment_notification_url\":\"ipn\", \"finish redirect_url\":\"ipn\", \"unfinish redirect_url\":\"failed\",\"error redirect_url\":\"failed\"}', '14835.20000000', '{\"0\":{\"IDR\":\"IDR\"}}', '1.00000000', '10000.00000000', '0.0000', '0.05000000', 1, '', '63b6b02748f191672917031.png', 12, '2020-09-10 03:05:02', '2023-01-29 01:40:33'),
(25, 'cashmaal', 'cashmaal', 'PKR', 'PKR', '{\"web_id\":\"\",\"ipn_key\":\"\"}', '{\"ipn_url\":\"ipn\"}', '0.85000000', '{\"0\":{\"PKR\":\"PKR\",\"USD\":\"USD\"}}', '100.00000000', '10000.00000000', '0.0000', '0.50000000', 1, '', 'cashmaal.jpg', 3, '2020-09-10 09:05:02', '2023-01-29 01:40:33'),
(26, 'peachpayments', 'peachpayments', 'USD', 'USD', '{\"Authorization_Bearer\":\"\",\"Entity_ID\":\"\",\"Recur_Channel\":\"\"}', NULL, '1.00000000', '{\"0\":{\"AED\":\"AED\",\"AFA\":\"AFA\",\"AMD\":\"AMD\",\"ANG\":\"ANG\",\"AOA\":\"AOA\",\"ARS\":\"ARS\",\"AUD\":\"AUD\",\"AWG\":\"AWG\",\"AZM\":\"AZM\",\"BAM\":\"BAM\",\"BBD\":\"BBD\",\"BDT\":\"BDT\",\"BGN\":\"BGN\",\"BHD\":\"BHD\",\"BIF\":\"BIF\",\"BMD\":\"BMD\",\"BND\":\"BND\",\"BOB\":\"BOB\",\"BRL\":\"BRL\",\"BSD\":\"BSD\",\"BTN\":\"BTN\",\"BWP\":\"BWP\",\"BYR\":\"BYR\",\"BZD\":\"BZD\",\"CAD\":\"CAD\",\"CDF\":\"CDF\",\"CHF\":\"CHF\",\"CLP\":\"CLP\",\"CNY\":\"CNY\",\"COP\":\"COP\",\"CRC\":\"CRC\",\"CUP\":\"CUP\",\"CVE\":\"CVE\",\"CYP\":\"CYP\",\"CZK\":\"CZK\",\"DJF\":\"DJF\",\"DKK\":\"DKK\",\"DOP\":\"DOP\",\"DZD\":\"DZD\",\"EEK\":\"EEK\",\"EGP\":\"EGP\",\"ERN\":\"ERN\",\"ETB\":\"ETB\",\"EUR\":\"EUR\",\"FJD\":\"FJD\",\"FKP\":\"FKP\",\"GBP\":\"GBP\",\"GEL\":\"GEL\",\"GGP\":\"GGP\",\"GHC\":\"GHC\",\"GIP\":\"GIP\",\"GMD\":\"GMD\",\"GNF\":\"GNF\",\"GTQ\":\"GTQ\",\"GYD\":\"GYD\",\"HKD\":\"HKD\",\"HNL\":\"HNL\",\"HRK\":\"HRK\",\"HTG\":\"HTG\",\"HUF\":\"HUF\",\"IDR\":\"IDR\",\"ILS\":\"ILS\",\"IMP\":\"IMP\",\"INR\":\"INR\",\"IQD\":\"IQD\",\"IRR\":\"IRR\",\"ISK\":\"ISK\",\"JEP\":\"JEP\",\"JMD\":\"JMD\",\"JOD\":\"JOD\",\"JPY\":\"JPY\",\"KES\":\"KES\",\"KGS\":\"KGS\",\"KHR\":\"KHR\",\"KMF\":\"KMF\",\"KPW\":\"KPW\",\"KRW\":\"KRW\",\"KWD\":\"KWD\",\"KYD\":\"KYD\",\"KZT\":\"KZT\",\"LAK\":\"LAK\",\"LBP\":\"LBP\",\"LKR\":\"LKR\",\"LRD\":\"LRD\",\"LSL\":\"LSL\",\"LTL\":\"LTL\",\"LVL\":\"LVL\",\"LYD\":\"LYD\",\"MAD\":\"MAD\",\"MDL\":\"MDL\",\"MGA\":\"MGA\",\"MKD\":\"MKD\",\"MMK\":\"MMK\",\"MNT\":\"MNT\",\"MOP\":\"MOP\",\"MRO\":\"MRO\",\"MTL\":\"MTL\",\"MUR\":\"MUR\",\"MVR\":\"MVR\",\"MWK\":\"MWK\",\"MXN\":\"MXN\",\"MYR\":\"MYR\",\"MZM\":\"MZM\",\"NAD\":\"NAD\",\"NGN\":\"NGN\",\"NIO\":\"NIO\",\"NOK\":\"NOK\",\"NPR\":\"NPR\",\"NZD\":\"NZD\",\"OMR\":\"OMR\",\"PAB\":\"PAB\",\"PEN\":\"PEN\",\"PGK\":\"PGK\",\"PHP\":\"PHP\",\"PKR\":\"PKR\",\"PLN\":\"PLN\",\"PTS\":\"PTS\",\"PYG\":\"PYG\",\"QAR\":\"QAR\",\"RON\":\"RON\",\"RUB\":\"RUB\",\"RWF\":\"RWF\",\"SAR\":\"SAR\",\"SBD\":\"SBD\",\"SCR\":\"SCR\",\"SDD\":\"SDD\",\"SEK\":\"SEK\",\"SGD\":\"SGD\",\"SHP\":\"SHP\",\"SIT\":\"SIT\",\"SKK\":\"SKK\",\"SLL\":\"SLL\",\"SOS\":\"SOS\",\"SPL\":\"SPL\",\"SRD\":\"SRD\",\"STD\":\"STD\",\"SVC\":\"SVC\",\"SYP\":\"SYP\",\"SZL\":\"SZL\",\"THB\":\"THB\",\"TJS\":\"TJS\",\"TMM\":\"TMM\",\"TND\":\"TND\",\"TOP\":\"TOP\",\"TRL\":\"TRL\",\"TRY\":\"TRY\",\"TTD\":\"TTD\",\"TVD\":\"TVD\",\"TWD\":\"TWD\",\"TZS\":\"TZS\",\"UAH\":\"UAH\",\"UGX\":\"UGX\",\"USD\":\"USD\",\"UYU\":\"UYU\",\"UZS\":\"UZS\",\"VEF\":\"VEF\",\"VND\":\"VND\",\"VUV\":\"VUV\",\"WST\":\"WST\",\"XAF\":\"XAF\",\"XAG\":\"XAG\",\"XAU\":\"XAU\",\"XCD\":\"XCD\",\"XDR\":\"XDR\",\"XOF\":\"XOF\",\"XPD\":\"XPD\",\"XPF\":\"XPF\",\"XPT\":\"XPT\",\"YER\":\"YER\",\"ZAR\":\"ZAR\",\"ZMK\":\"ZMK\",\"ZWD\":\"ZWD\"}}', '100.00000000', '10000.00000000', '0.0000', '0.50000000', 1, '', '63b69d81f06f21672912257.png', 11, '2020-09-10 09:05:02', '2023-01-29 01:40:33'),
(27, 'Nowpayments', 'nowpayments', 'BTC', 'BTC', '{\"api_key\":\"\"}', '{\"cron\":\"ipn\"}', '1.00000000', '{\"1\":{\"BTC\":\"BTC\",\"LTC\":\"LTC\",\"DOGE\":\"DOGE\"}}', '10.10000000', '10000.00000000', '0.0000', '0.50000000', 1, NULL, '63b6a0f262c9f1672913138.jpg', 7, '2020-09-10 03:05:02', '2023-01-29 01:40:33'),
(28, 'Khalti Payment', 'khalti', 'NPR', 'NPR', '{\"secret_key\":\"\",\"public_key\":\"\"}', NULL, '1.00000000', '{\"0\":{\"NPR\":\"NPR\"}}', '100.00000000', '10000.00000000', '0.0000', '0.00000000', 1, '', '63b6ab4d45abb1672915789.webp', 9, '2020-09-10 03:05:02', '2023-01-29 01:40:33'),
(29, 'MAGUA PAY', 'swagger', 'EUR', 'EUR', '{\"MAGUA_PAY_ACCOUNT\":\"\",\"MerchantKey\":\"\",\"Secret\":\"\"}', NULL, '1.00000000', '{\"0\":{\"EUR\":\"EUR\"}}', '100.00000000', '10000.00000000', '0.0000', '0.00000000', 1, '', '63b6c23aac9181672921658.png', 8, '2020-09-10 03:05:02', '2023-01-29 01:40:33'),
(30, 'Free kassa', 'freekassa', 'RUB', 'RUB', '{\"merchant_id\":\"\",\"merchant_key\":\"\",\"secret_word\":\"\",\"secret_word2\":\"\"}', '{\"ipn_url\":\"ipn\"}', '1.00000000', '{\"0\":{\"RUB\":\"RUB\",\"USD\":\"USD\",\"EUR\":\"EUR\",\"UAH\":\"UAH\",\"KZT\":\"KZT\"}}', '10.00000000', '10000.00000000', '0.1000', '0.00000000', 1, NULL, '63b6c5f19bbd21672922609.jpg', 5, '2020-09-10 03:05:02', '2023-01-29 01:40:33'),
(31, 'Konnect', 'konnect', 'USD', 'USD', '{\"api_key\":\"\",\"receiver_wallet_Id\":\"\"}', '{\"webhook\":\"ipn\"}', '1.00000000', '{\"0\":{\"TND\":\"TND\",\"EUR\":\"EUR\",\"USD\":\"USD\"}}', '1.00000000', '10000.00000000', '0.0000', '0.00000000', 1, '', '63b6c79b0e05a1672923035.jpg', 4, '2020-09-10 03:05:02', '2023-01-29 01:40:33'),
(32, 'Mypay Np', 'mypay', 'NPR', 'NPR', '{\"merchant_username\":\"\",\"merchant_api_password\":\"\",\"merchant_id\":\"\",\"api_key\":\"\"}', NULL, '1.00000000', '{\"0\":{\"NPR\":\"NPR\"}}', '1.00000000', '100000.00000000', '1.5000', '0.00000000', 1, '', '63b6c9e2b69431672923618.png', 10, '2020-09-10 03:05:02', '2023-01-29 01:40:33'),
(1000, 'Bank Transfer', 'bank-transfer', 'BDT', 'BDT', '{\"AccountNumber\":{\"field_name\":\"AccountNumber\",\"field_level\":\"Account Number\",\"type\":\"text\",\"validation\":\"required\"},\"BeneficiaryName\":{\"field_name\":\"BeneficiaryName\",\"field_level\":\"Beneficiary Name\",\"type\":\"text\",\"validation\":\"required\"},\"NID\":{\"field_name\":\"NID\",\"field_level\":\"NID\",\"type\":\"file\",\"validation\":\"nullable\"},\"Address\":{\"field_name\":\"Address\",\"field_level\":\"Address\",\"type\":\"textarea\",\"validation\":\"nullable\"}}', NULL, '84.00000000', NULL, '10.00000000', '10000.00000000', '0.0000', '5.00000000', 1, 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for \'lorem ipsum\' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).', '61d16f5313ee41641115475.jpg', 1, '2022-01-02 03:18:56', '2023-01-05 07:06:22');

-- --------------------------------------------------------

--
-- Table structure for table `identify_forms`
--

CREATE TABLE `identify_forms` (
  `id` int(11) UNSIGNED NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `slug` varchar(50) DEFAULT NULL,
  `services_form` text DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `identify_forms`
--

INSERT INTO `identify_forms` (`id`, `name`, `slug`, `services_form`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Driving License', 'driving-license', '{\"FrontPage\":{\"field_name\":\"FrontPage\",\"field_level\":\"Front Page\",\"type\":\"file\",\"field_length\":\"2500\",\"length_type\":\"max\",\"validation\":\"required\"},\"RearPage\":{\"field_name\":\"RearPage\",\"field_level\":\"Rear Page\",\"type\":\"file\",\"field_length\":\"2500\",\"length_type\":\"max\",\"validation\":\"required\"},\"PassportNumber\":{\"field_name\":\"PassportNumber\",\"field_level\":\"Passport Number\",\"type\":\"text\",\"field_length\":\"20\",\"length_type\":\"max\",\"validation\":\"required\"},\"Address\":{\"field_name\":\"Address\",\"field_level\":\"Address\",\"type\":\"textarea\",\"field_length\":\"300\",\"length_type\":\"max\",\"validation\":\"required\"}}', 1, '2021-09-30 22:07:40', '2022-05-17 06:29:36'),
(2, 'Passport', 'passport', '{\"PassportNumber\":{\"field_name\":\"PassportNumber\",\"field_level\":\"Passport Number\",\"type\":\"text\",\"field_length\":\"25\",\"length_type\":\"max\",\"validation\":\"required\"},\"PassportImage\":{\"field_name\":\"PassportImage\",\"field_level\":\"Passport Image\",\"type\":\"file\",\"field_length\":\"1040\",\"length_type\":\"max\",\"validation\":\"required\"}}', 1, '2021-09-30 22:16:23', '2022-05-17 06:29:40'),
(4, 'National ID', 'national-id', '{\"FrontPage\":{\"field_name\":\"FrontPage\",\"field_level\":\"Front Page\",\"type\":\"file\",\"field_length\":\"500\",\"length_type\":\"max\",\"validation\":\"required\"},\"RearPage\":{\"field_name\":\"RearPage\",\"field_level\":\"Rear Page\",\"type\":\"file\",\"field_length\":\"500\",\"length_type\":\"max\",\"validation\":\"required\"},\"NidNumber\":{\"field_name\":\"NidNumber\",\"field_level\":\"Nid Number\",\"type\":\"text\",\"field_length\":\"10\",\"length_type\":\"digits\",\"validation\":\"required\"},\"Address\":{\"field_name\":\"Address\",\"field_level\":\"Address\",\"type\":\"textarea\",\"field_length\":\"300\",\"length_type\":\"max\",\"validation\":\"required\"}}', 1, '2021-10-01 07:58:40', '2022-05-17 06:29:48');

-- --------------------------------------------------------

--
-- Table structure for table `investments`
--

CREATE TABLE `investments` (
  `id` int(11) UNSIGNED NOT NULL,
  `user_id` int(11) UNSIGNED DEFAULT NULL,
  `plan_id` int(11) UNSIGNED DEFAULT NULL,
  `amount` decimal(11,2) DEFAULT NULL,
  `profit` decimal(11,2) DEFAULT NULL,
  `maturity` int(11) NOT NULL,
  `point_in_time` varchar(50) DEFAULT NULL,
  `point_in_text` varchar(60) NOT NULL,
  `recurring_time` int(11) UNSIGNED NOT NULL DEFAULT 0,
  `afterward` timestamp NOT NULL DEFAULT current_timestamp(),
  `formerly` timestamp NULL DEFAULT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 1 COMMENT '1 => Running, 0=> completed',
  `capital_back` tinyint(1) NOT NULL DEFAULT 0 COMMENT '1 = YES & 0 = NO',
  `trx` varchar(40) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` int(11) UNSIGNED NOT NULL,
  `queue` varchar(191) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `kycs`
--

CREATE TABLE `kycs` (
  `id` int(11) UNSIGNED NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `admin_id` int(11) DEFAULT NULL,
  `kyc_type` varchar(20) DEFAULT NULL,
  `details` text DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0 COMMENT '1=> Approved, 2 => Reject',
  `feedback` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `languages`
--

CREATE TABLE `languages` (
  `id` int(11) UNSIGNED NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `short_name` varchar(10) DEFAULT NULL,
  `flag` varchar(100) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1 COMMENT '1 = active, 0 = inactive',
  `rtl` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `languages`
--

INSERT INTO `languages` (`id`, `name`, `short_name`, `flag`, `is_active`, `rtl`, `created_at`, `updated_at`) VALUES
(1, 'English', 'US', NULL, 1, 0, '2021-12-17 10:00:55', '2021-12-17 10:00:55'),
(17, 'Hindi', 'IN', NULL, 1, 1, '2021-12-17 10:00:55', '2022-05-16 23:28:07'),
(18, 'Spanish', 'ES', NULL, 1, 0, '2021-12-17 10:00:55', '2021-12-17 10:31:02');

-- --------------------------------------------------------

--
-- Table structure for table `manage_plans`
--

CREATE TABLE `manage_plans` (
  `id` int(11) UNSIGNED NOT NULL,
  `name` varchar(50) NOT NULL,
  `badge` varchar(191) DEFAULT NULL,
  `minimum_amount` varchar(20) DEFAULT NULL,
  `maximum_amount` varchar(20) DEFAULT NULL,
  `fixed_amount` varchar(20) DEFAULT NULL,
  `profit` decimal(11,2) NOT NULL DEFAULT 0.00 COMMENT 'Yield',
  `profit_type` tinyint(1) NOT NULL DEFAULT 0 COMMENT '1 for percent(%) /  0 For Base Currency',
  `schedule` int(11) DEFAULT NULL COMMENT 'Accrual',
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `is_capital_back` tinyint(1) NOT NULL DEFAULT 0,
  `is_lifetime` tinyint(1) NOT NULL DEFAULT 0,
  `repeatable` int(11) DEFAULT 1 COMMENT 'Maturity',
  `featured` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `manage_times`
--

CREATE TABLE `manage_times` (
  `id` int(11) UNSIGNED NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `time` varchar(50) DEFAULT NULL COMMENT 'Hourly',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `manage_times`
--

INSERT INTO `manage_times` (`id`, `name`, `time`, `created_at`, `updated_at`) VALUES
(1, 'Hour', '1', '2021-12-17 10:01:10', '2021-12-17 10:01:10'),
(2, 'Day', '24', '2021-12-17 10:01:10', '2021-12-17 10:01:10'),
(3, 'Week', '168', '2021-12-17 10:01:10', '2021-12-17 10:01:10'),
(4, 'Month', '720', '2021-12-17 10:01:10', '2021-12-17 10:01:10'),
(5, 'Year', '8760', '2021-12-17 10:01:10', '2021-12-17 10:01:10');

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(191) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(2, '2014_10_12_100000_create_password_resets_table', 1),
(3, '2019_08_19_000000_create_failed_jobs_table', 1),
(8, '2020_09_29_074810_create_jobs_table', 1),
(32, '2020_11_12_075639_create_transactions_table', 6),
(36, '2020_10_14_113046_create_admins_table', 9),
(42, '2020_11_24_064711_create_email_templates_table', 11),
(48, '2014_10_12_000000_create_users_table', 13),
(51, '2020_09_16_103709_create_controls_table', 15),
(59, '2021_01_03_061604_create_tickets_table', 17),
(60, '2021_01_03_061834_create_ticket_messages_table', 18),
(61, '2021_01_03_065607_create_ticket_attachments_table', 18),
(62, '2021_01_07_095019_create_funds_table', 19),
(66, '2021_01_21_050226_create_languages_table', 21),
(69, '2020_12_17_075238_create_sms_controls_table', 23),
(70, '2021_01_26_051716_create_site_notifications_table', 24),
(72, '2021_01_26_075451_create_notify_templates_table', 25),
(73, '2021_01_28_074544_create_contents_table', 26),
(74, '2021_01_28_074705_create_content_details_table', 26),
(75, '2021_01_28_074829_create_content_media_table', 26),
(76, '2021_01_28_074847_create_templates_table', 26),
(77, '2021_01_28_074905_create_template_media_table', 26),
(83, '2021_02_03_100945_create_subscribers_table', 27),
(86, '2021_01_21_101641_add_language_to_email_templates_table', 28),
(87, '2021_02_14_064722_create_manage_plans_table', 28),
(88, '2021_02_14_072251_create_manage_times_table', 29),
(89, '2021_03_09_100340_create_investments_table', 30),
(90, '2021_03_13_132414_create_payout_methods_table', 31),
(91, '2021_03_13_133534_create_payout_logs_table', 32),
(93, '2021_03_18_091710_create_referral_bonuses_table', 33),
(94, '2021_10_25_060950_create_money_transfers_table', 34),
(96, '2021_03_18_091710_create_users_table', 35),
(97, '2022_12_08_130225_create_withdraw_settings_table', 36),
(98, '2022_12_08_140618_create_payout_settings_table', 37),
(111, '2022_12_27_120051_create_rankings_table', 38);

-- --------------------------------------------------------

--
-- Table structure for table `money_transfers`
--

CREATE TABLE `money_transfers` (
  `id` int(11) UNSIGNED NOT NULL,
  `sender_id` int(11) DEFAULT NULL,
  `receiver_id` int(11) DEFAULT NULL,
  `amount` decimal(11,2) DEFAULT NULL,
  `charge` decimal(11,2) DEFAULT NULL,
  `trx` varchar(20) DEFAULT NULL,
  `send_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notify_templates`
--

CREATE TABLE `notify_templates` (
  `id` int(11) UNSIGNED NOT NULL,
  `language_id` int(11) UNSIGNED DEFAULT NULL,
  `name` varchar(191) DEFAULT NULL,
  `template_key` varchar(191) DEFAULT NULL,
  `body` text DEFAULT NULL,
  `short_keys` text DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `notify_for` tinyint(1) NOT NULL DEFAULT 0 COMMENT '1=> Admin, 0=> User',
  `lang_code` varchar(191) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `notify_templates`
--

INSERT INTO `notify_templates` (`id`, `language_id`, `name`, `template_key`, `body`, `short_keys`, `status`, `notify_for`, `lang_code`, `created_at`, `updated_at`) VALUES
(1, 1, 'ADMIN NOTIFY USER CREATE TICKET', 'ADMIN_NOTIFY_USER_CREATE_TICKET', '[[name]] create a ticket\r\nTicket : [[ticket_id]]\r\n\r\n', '{\"ticket_id\":\"ticket_id\",\"name\":\"name\"}', 1, 1, NULL, '2021-12-17 10:01:53', '2021-12-17 10:01:53'),
(2, 1, 'SUPPORT TICKET REPLY', 'ADMIN_NOTIFY_USER_REPLY_TICKET', '[[name]] replied  ticket\r\nTicket : [[ticket_id]]\r\n\r\n', '{\"ticket_id\":\"ticket_id\",\"name\":\"name\"}', 1, 1, NULL, '2021-12-17 10:01:53', '2021-12-17 10:01:53'),
(3, 1, 'USER NOTIFY ADMIN TICKET REPLY', 'USER_NOTIFY_ADMIN_TICKET_REPLY', '[[name]] replied  \r\nTicket : [[ticket_id]]', '{\"ticket_id\":\"ticket_id\",\"name\":\"name\"}', 1, 0, 'en', '2021-12-17 10:01:53', '2021-12-17 10:01:53'),
(4, 1, 'ADMIN NOTIFY FUND DEPOSIT PAYMENT COMPLETE', 'ADMIN_NOTIFY_FUND_DEPOSIT_PAYMENT_COMPLETE', '[[username]] deposited [[amount]] [[currency]] via [[gateway]]\r\n', '{\"gateway\":\"gateway\",\"amount\":\"amount\",\"currency\":\"currency\",\"username\":\"username\"}', 1, 1, NULL, '2021-12-17 10:01:53', '2021-12-17 10:01:53'),
(5, 1, 'ADD BALANCE', 'ADD_BALANCE', '[[amount]] [[currency]] credited in your account. \r\n\r\n\r\nYour Current Balance [[main_balance]][[currency]]\r\n\r\nTransaction: #[[transaction]]', '{\"transaction\":\"Transaction Number\",\"amount\":\"Request Amount By Admin\",\"currency\":\"Site Currency\", \"main_balance\":\"Users Balance After this operation\"}', 1, 0, 'en', '2021-12-17 10:01:53', '2021-12-17 10:01:53'),
(6, 1, 'DEDUCTED BALANCE', 'DEDUCTED_BALANCE', '[[amount]] [[currency]] debited in your account.\r\n\r\nYour Current Balance [[main_balance]][[currency]]\r\n\r\nTransaction: #[[transaction]]', '{\"transaction\":\"Transaction Number\",\"amount\":\"Request Amount By Admin\",\"currency\":\"Site Currency\", \"main_balance\":\"Users Balance After this operation\"}', 1, 0, 'en', '2021-12-17 10:01:53', '2021-12-17 10:01:53'),
(7, 1, 'REGISTER NEW USER NOTIFY TO ADMIN', 'REGISTER_NEW_USER_NOTIFY_TO_ADMIN', '[[fullname]] has been joined\r\n\r\n', '{\"fullname\":\"fullname\"}', 1, 1, 'en', '2021-12-17 10:01:53', '2021-12-17 10:01:53'),
(16, 1, 'PLAN PURCHASE NOTIFICATION TO ADMIN', 'PLAN_PURCHASE_NOTIFY_TO_ADMIN', '[[username]] purchase a plan by [[amount]] [[currency]] \r\n\r\nPlan name [[plan_name]]', '{\"plan_name\":\"plan name\",\"amount\":\"amount\",\"currency\":\"currency\",\"username\":\"username\"}', 1, 1, NULL, '2021-12-17 10:01:53', '2021-12-17 10:01:53'),
(17, 1, 'PAYOUT REQUEST NOTIFICATION TO ADMIN', 'ADMIN_NOTIFY_PAYOUT_REQUEST', '[[username]] withdraw requested by [[amount]] [[currency]] \r\n\r\n', '{\"amount\":\"amount\",\"currency\":\"currency\",\"username\":\"username\"}', 1, 1, NULL, '2021-12-17 10:01:53', '2021-12-17 10:01:53'),
(19, 1, 'ADMIN NOTIFY PAYOUT REJECTED', 'ADMIN_NOTIFY_PAYOUT_REJECTED', '[[user_name]] [[amount]] [[currency]]  withdraw requested has been rejected\r\n\r\n', '{\"amount\":\"amount\",\"currency\":\"currency\",\"user_name\":\"user_name\"}', 1, 1, NULL, '2021-12-17 10:01:53', '2021-12-17 10:01:53'),
(20, 1, 'ADMIN NOTIFY PAYOUT APPROVE', 'ADMIN_NOTIFY_PAYOUT_APPROVE', '[[user_name]] [[amount]] [[currency]]  withdraw requested has been approved\r\n\r\n', '{\"amount\":\"amount\",\"currency\":\"currency\",\"user_name\":\"user_name\"}', 1, 1, NULL, '2021-12-17 10:01:53', '2021-12-17 10:01:53'),
(21, 1, 'REFERRAL BONUS', 'REFERRAL_BONUS', 'You got [[amount]] [[currency]]  Referral bonus From  [[bonus_from]] ', '{\"bonus_from\":\"bonus from User\",\"amount\":\"amount\",\"currency\":\"currency\",\"level\":\"level\"}', 1, 0, NULL, '2021-12-17 10:01:53', '2021-12-17 10:01:53'),
(24, 1, 'ADMIN NOTIFY PAYMENT REQUEST', 'ADMIN_NOTIFY_PAYMENT_REQUEST', '[[username]] deposit request [[amount]] [[currency]] via [[gateway]]\r\n', '{\"gateway\":\"gateway\",\"amount\":\"amount\",\"currency\":\"currency\",\"username\":\"username\"}', 1, 1, NULL, '2021-12-17 10:01:53', '2021-12-17 10:01:53'),
(25, 1, 'PAYMENT REJECTED', 'PAYMENT_REJECTED', '[[amount]] [[currency]] payment has been rejected \r\n\r\n', '{\"amount\":\"amount\",\"currency\":\"currency\",\"feedback\":\"Admin feedback\"}', 1, 0, NULL, '2021-12-17 10:01:53', '2021-12-17 10:01:53'),
(26, 1, 'PAYMENT APPROVED', 'PAYMENT_APPROVED', '[[amount]] [[currency]] payment has been approved\r\n\r\n', '{\"amount\":\"amount\",\"currency\":\"currency\"}', 1, 0, NULL, '2021-12-17 10:01:53', '2021-12-17 10:01:53'),
(27, 1, 'ADMIN NOTIFY BALANCE TRANSFER', 'ADMIN_NOTIFY_BALANCE_TRANSFER', '[[send_user]] transfered [[amount]] [[currency]] to [[to_user]]. \r\n', '{\"send_user\":\"send_user\",\"to_user\":\"to_user\",\"amount\":\"amount\", \"currency\":\"currency\"}', 1, 1, 'en', '2021-12-17 10:01:53', '2021-12-17 10:01:53'),
(28, 1, 'SUBSCRIBE NEWSLETTER', 'SUBSCRIBE_NEWSLETTER', '[[email]] has subscribed to our newsletter\r\n', '{\"email\":\"email\"}', 1, 1, 'en', '2021-12-17 10:01:53', '2021-12-17 10:01:53'),
(29, 1, 'PLAN PURCHASE NOTIFICATION TO USER', 'PLAN_PURCHASE_NOTIFY_TO_USER', '[[username]] purchase a plan by [[amount]] [[currency]] \r\n\r\nPlan name [[plan_name]]', '{\"plan_name\":\"plan name\",\"amount\":\"amount\",\"currency\":\"currency\",\"username\":\"username\"}', 1, 0, NULL, '2021-12-17 10:01:53', '2021-12-17 10:01:53'),
(30, 1, 'REGISTER NEW USER NOTIFY TO USER', 'REGISTER_NEW_USER_NOTIFY_TO_USER', '[[fullname]] has been successfully registered\r\n\r\n', '{\"fullname\":\"fullname\"}', 1, 0, 'en', '2021-12-17 10:01:53', '2021-12-17 10:01:53'),
(31, 1, 'LOGIN NOTIFY TO USER', 'LOGIN_NOTIFY_TO_USER', '[[name]] logged in\r\n\r\n', '{\"name\":\"name\"}', 1, 0, 'en', '2021-12-17 10:01:53', '2021-12-17 10:01:53'),
(32, 1, 'LOGIN NOTIFY TO ADMIN', 'LOGIN_NOTIFY_TO_ADMIN', '[[name]] logged in\r\n\r\n', '{\"name\":\"name\"}', 1, 1, 'en', '2021-12-17 10:01:53', '2021-12-17 10:01:53'),
(33, 1, 'USER NOTIFY PAYMENT REQUEST', 'USER_NOTIFY_PAYMENT_REQUEST', '[[username]] deposit request [[amount]] [[currency]] via [[gateway]]\r\n', '{\"gateway\":\"gateway\",\"amount\":\"amount\",\"currency\":\"currency\",\"username\":\"username\"}', 1, 0, NULL, '2021-12-17 10:01:53', '2021-12-17 10:01:53'),
(34, 1, 'USER NOTIFY FUND DEPOSIT PAYMENT COMPLETE', 'USER_NOTIFY_FUND_DEPOSIT_PAYMENT_COMPLETE', '[[username]] deposited [[amount]] [[currency]] via [[gateway]]\r\n', '{\"gateway\":\"gateway\",\"amount\":\"amount\",\"currency\":\"currency\",\"username\":\"username\"}', 1, 0, NULL, '2021-12-17 10:01:53', '2021-12-17 10:01:53'),
(35, 1, 'SENDER NOTIFY BALANCE TRANSFER', 'SENDER_NOTIFY_BALANCE_TRANSFER', '[[send_user]] transfered [[amount]] [[currency]] to [[to_user]]. \r\n', '{\"send_user\":\"send_user\",\"to_user\":\"to_user\",\"amount\":\"amount\", \"currency\":\"currency\"}', 1, 0, 'en', '2021-12-17 10:01:53', '2021-12-17 10:01:53'),
(36, 1, 'RECEIVER NOTIFY BALANCE TRANSFER', 'RECEIVER_NOTIFY_BALANCE_TRANSFER', '[[send_user]] transfered [[amount]] [[currency]] to [[to_user]]. \r\n', '{\"send_user\":\"send_user\",\"to_user\":\"to_user\",\"amount\":\"amount\", \"currency\":\"currency\"}', 1, 0, 'en', '2021-12-17 10:01:53', '2021-12-17 10:01:53'),
(37, 1, 'PAYOUT REQUEST NOTIFICATION TO USER', 'USER_NOTIFY_PAYOUT_REQUEST', '[[username]] payout requested by [[amount]] [[currency]] \r\n\r\n', '{\"amount\":\"amount\",\"currency\":\"currency\",\"username\":\"username\"}', 1, 0, NULL, '2021-12-17 10:01:53', '2021-12-17 10:01:53'),
(38, 1, 'ADMIN NOTIFY USER PROFILE UPDATE', 'ADMIN_NOTIFY_USER_PROFILE_UPDATE', '[[name]] update your profile\r\n\r\n', '{\"name\":\"name\"}', 1, 1, NULL, '2021-12-17 10:01:53', '2021-12-17 10:01:53'),
(39, 1, 'USER NOTIFY HIS PROFILE UPDATE', 'USER_NOTIFY_HIS_PROFILE_UPDATE', '[[name]] updated your profile\r\n\r\n', '{\"name\":\"name\"}', 1, 0, NULL, '2021-12-17 10:01:53', '2021-12-17 10:01:53'),
(40, 1, 'ADMIN NOTIFY USER PROFILE INFORMATION UPDATE', 'ADMIN_NOTIFY_USER_PROFILE_INFORMATION_UPDATE', '[[name]] update your profile information\r\n\r\n', '{\"name\":\"name\"}', 1, 1, NULL, '2021-12-17 10:01:53', '2021-12-17 10:01:53'),
(41, 1, 'USER NOTIFY HIS PROFILE INFORMATION UPDATE', 'USER_NOTIFY_HIS_PROFILE_INFORMATION_UPDATE', '[[name]] update your profile information\r\n\r\n', '{\"name\":\"name\"}', 1, 0, NULL, '2021-12-17 10:01:53', '2021-12-17 10:01:53'),
(42, 1, 'ADMIN NOTIFY USER PROFILE PASSWORD UPDATE', 'ADMIN_NOTIFY_USER_PROFILE_PASSWORD_UPDATE', '[[name]] update your profile password\r\n\r\n', '{\"name\":\"name\"}', 1, 1, NULL, '2021-12-17 10:01:53', '2021-12-17 10:01:53'),
(43, 1, 'USER NOTIFY HIS PROFILE PASSWORD UPDATE', 'USER_NOTIFY_HIS_PROFILE_PASSWORD_UPDATE', '[[name]] update your profile password\r\n\r\n', '{\"name\":\"name\"}', 1, 0, NULL, '2021-12-17 10:01:53', '2021-12-17 10:01:53'),
(44, 1, 'ADMIN NOTIFY USER KYC REQUEST', 'ADMIN_NOTIFY_USER_KYC_REQUEST', '[[name]] send kyc request\r\n\r\n', '{\"name\":\"name\"}', 1, 1, NULL, '2021-12-17 10:01:53', '2021-12-17 10:01:53'),
(45, 1, 'USER NOTIFY HIS KYC REQUEST SEND', 'USER_NOTIFY_HIS_KYC_REQUEST_SEND', '[[name]] send your kyc request\r\n\r\n', '{\"name\":\"name\"}', 1, 0, NULL, '2021-12-17 10:01:53', '2021-12-17 10:01:53'),
(46, 1, 'ADMIN NOTIFY USER ADDRESS VERIFICATION REQUEST', 'ADMIN_NOTIFY_USER_ADDRESS_VERIFICATION_REQUEST', '[[name]] send address verification request\r\n\r\n', '{\"name\":\"name\"}', 1, 1, NULL, '2021-12-17 10:01:53', '2021-12-17 10:01:53'),
(47, 1, 'USER NOTIFY ADDRESS VERIFICATION REQUEST SEND', 'USER_NOTIFY_ADDRESS_VERIFICATION_REQUEST_SEND', '[[name]] send your address verification request\r\n\r\n', '{\"name\":\"name\"}', 1, 0, NULL, '2021-12-17 10:01:53', '2021-12-17 10:01:53'),
(48, 1, 'USER NOTIFY CREATE TICKET', 'USER_NOTIFY_CREATE_TICKET', '[[name]] create a ticket\r\nTicket : [[ticket_id]]\r\n\r\n', '{\"ticket_id\":\"ticket_id\",\"name\":\"name\"}', 1, 0, NULL, '2021-12-17 10:01:53', '2021-12-17 10:01:53'),
(49, 1, 'SUPPORT TICKET REPLY', 'USER_NOTIFY_OWN_TICKET_REPLY', '[[name]] replied  ticket\r\nTicket : [[ticket_id]]\r\n\r\n', '{\"ticket_id\":\"ticket_id\",\"name\":\"name\"}', 1, 0, NULL, '2021-12-17 10:01:53', '2021-12-17 10:01:53'),
(50, 1, 'ADMIN NOTIFY USER TICKET CLOSE', 'ADMIN_NOTIFY_USER_TICKET_CLOSE', '[[name]] closed a ticket\r\nTicket : [[ticket_id]]\r\n\r\n', '{\"ticket_id\":\"ticket_id\",\"name\":\"name\"}', 1, 1, NULL, '2021-12-17 10:01:53', '2021-12-17 10:01:53'),
(51, 1, 'USER NOTIFY OWN TICKET CLOSE', 'USER_NOTIFY_OWN_TICKET_CLOSE', '[[name]] closed a ticket\r\nTicket : [[ticket_id]]\r\n\r\n', '{\"ticket_id\":\"ticket_id\",\"name\":\"name\"}', 1, 0, NULL, '2021-12-17 10:01:53', '2021-12-17 10:01:53'),
(52, 1, 'ADMIN NOTIFY OWN SUPPORT REPLY', 'ADMIN_NOTIFY_OWN_SUPPORT_REPLY', '[[name]] replied  \r\nTicket : [[ticket_id]]', '{\"ticket_id\":\"ticket_id\",\"name\":\"name\"}', 1, 1, 'en', '2021-12-17 10:01:53', '2021-12-17 10:01:53'),
(53, 1, 'ADMIN NOTIFY SUPPORT TICKET CLOSED', 'ADMIN_NOTIFY_SUPPORT_TICKET_CLOSED', '[[name]] closed ticket\r\nTicket : [[ticket_id]]\r\n\r\n', '{\"ticket_id\":\"ticket_id\",\"name\":\"name\"}', 1, 1, NULL, '2021-12-17 10:01:53', '2021-12-17 10:01:53'),
(54, 1, 'USER NOTIFY ADMIN TICKET CLOSED', 'USER_NOTIFY_ADMIN_TICKET_CLOSED', '[[name]] closed ticket\r\nTicket : [[ticket_id]]\r\n\r\n', '{\"ticket_id\":\"ticket_id\",\"name\":\"name\"}', 1, 0, NULL, '2021-12-17 10:01:53', '2021-12-17 10:01:53'),
(55, 1, 'ADMIN NOTIFY KYC APPROVED', 'ADMIN_NOTIFY_KYC_APPROVED', '[[user_name]] [[kyc_type]] has been apporved\r\n\r\n', '{\"kyc_type\":\"kyc_type\",\"user_name\":\"user_name\"}', 1, 1, NULL, '2021-12-17 10:01:53', '2021-12-17 10:01:53'),
(56, 1, 'USER NOTIFY KYC APPROVED', 'USER_NOTIFY_KYC_APPROVED', '[[kyc_type]] has been apporved\r\n\r\n', '{\"kyc_type\":\"kyc_type\"}', 1, 0, NULL, '2021-12-17 10:01:53', '2021-12-17 10:01:53'),
(57, 1, 'ADMIN NOTIFY KYC REJECTED', 'ADMIN_NOTIFY_KYC_REJECTED', '[[user_name]] [[kyc_type]] has been rejected\r\n\r\n', '{\"kyc_type\":\"kyc_type\",\"user_name\":\"user_name\"}', 1, 1, NULL, '2021-12-17 10:01:53', '2021-12-17 10:01:53'),
(58, 1, 'USER NOTIFY KYC REJECTED', 'USER_NOTIFY_KYC_REJECTED', '[[kyc_type]] has been rejected\r\n\r\n', '{\"kyc_type\":\"kyc_type\"}', 1, 0, NULL, '2021-12-17 10:01:53', '2021-12-17 10:01:53'),
(59, 1, 'USER NOTIFY PAYOUT APPROVE', 'USER_NOTIFY_PAYOUT_APPROVE', '[[amount]] [[currency]]  withdraw requested has been approved\r\n\r\n', '{\"amount\":\"amount\",\"currency\":\"currency\"}', 1, 0, NULL, '2021-12-17 10:01:53', '2021-12-17 10:01:53'),
(60, 1, 'USER NOTIFY PAYOUT REJECTED', 'USER_NOTIFY_PAYOUT_REJECTED', '[[amount]] [[currency]]  withdraw requested has been rejected\r\n\r\n', '{\"amount\":\"amount\",\"currency\":\"currency\"}', 1, 0, NULL, '2021-12-17 10:01:53', '2021-12-17 10:01:53'),
(61, 1, 'ADMIN NOTIFY WHEN ADMIN USER UPDATE', 'ADMIN_NOTIFY_WHEN_ADMIN_USER_UPDATE', '[[user_name]] profile information updated\r\n\r\n\r\n', '{\"user_name\":\"user_name\"}', 1, 1, NULL, '2021-12-17 10:01:53', '2021-12-17 10:01:53'),
(62, 1, 'USER NOTIFY WHEN ADMIN PROFILE UPDATE', 'USER_NOTIFY_WHEN_ADMIN_PROFILE_UPDATE', 'Admin your profile information updated\r\n\r\n\r\n', '{\"user_name\":\"user_name\"}', 1, 0, NULL, '2021-12-17 10:01:53', '2021-12-17 10:01:53'),
(63, 1, 'BADGE NOTIFICATION TO USER', 'BADGE_NOTIFY_TO_USER', '[[user]] Achieved [[badge]]\r\n\r\n', '{\"user\":\"user\",\"badge\":\"badge\"}', 1, 0, '', '2021-12-17 10:01:53', '2021-12-17 10:01:53'),
(64, 1, 'BADGE NOTIFICATION TO ADMIN', 'BADGE_NOTIFY_TO_ADMIN', '[[user]] Achieved [[badge]]\r\n\r\n', '{\"user\":\"user\",\"badge\":\"badge\"}', 1, 0, '', '2021-12-17 10:01:53', '2021-12-17 10:01:53');

-- --------------------------------------------------------

--
-- Table structure for table `password_resets`
--

CREATE TABLE `password_resets` (
  `email` varchar(191) NOT NULL,
  `token` varchar(191) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payout_logs`
--

CREATE TABLE `payout_logs` (
  `id` int(11) UNSIGNED NOT NULL,
  `user_id` int(11) UNSIGNED DEFAULT NULL,
  `method_id` int(11) UNSIGNED DEFAULT NULL,
  `amount` decimal(11,2) DEFAULT NULL,
  `charge` decimal(11,2) DEFAULT NULL,
  `net_amount` decimal(11,2) DEFAULT NULL,
  `information` text DEFAULT NULL,
  `feedback` text DEFAULT NULL,
  `trx_id` varchar(50) DEFAULT NULL,
  `status` tinyint(1) DEFAULT NULL COMMENT '1=> pending, 2=> success, 3=> cancel,',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `balance_type` varchar(25) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payout_methods`
--

CREATE TABLE `payout_methods` (
  `id` int(11) UNSIGNED NOT NULL,
  `name` varchar(191) DEFAULT NULL,
  `image` varchar(191) DEFAULT NULL,
  `minimum_amount` decimal(11,2) DEFAULT NULL,
  `maximum_amount` decimal(11,2) DEFAULT NULL,
  `fixed_charge` decimal(11,2) DEFAULT NULL,
  `percent_charge` decimal(11,2) DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `input_form` text NOT NULL,
  `duration` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `payout_methods`
--

INSERT INTO `payout_methods` (`id`, `name`, `image`, `minimum_amount`, `maximum_amount`, `fixed_charge`, `percent_charge`, `status`, `input_form`, `duration`, `created_at`, `updated_at`) VALUES
(1, 'Wire Transfer', '606418e821ad01617172712.jpg', '1.00', '2000.00', '10.00', '0.00', 1, '{\"email\":{\"field_name\":\"email\",\"field_level\":\"Email\",\"type\":\"text\",\"validation\":\"required\"},\"nid_number\":{\"field_name\":\"nid_number\",\"field_level\":\"NID Number\",\"type\":\"text\",\"validation\":\"required\"},\"passport_number\":{\"field_name\":\"passport_number\",\"field_level\":\"Passport Number\",\"type\":\"text\",\"validation\":\"nullable\"}}', '1-2 Hours', '2021-12-17 10:02:14', '2021-12-17 10:02:14'),
(2, 'Bank Transfer', '6064181b137c91617172507.jpg', '1.00', '100.00', '10.00', '1.00', 1, '{\"bank_name\":{\"field_name\":\"bank_name\",\"field_level\":\"Bank Name\",\"type\":\"text\",\"validation\":\"required\"},\"transaction_prove\":{\"field_name\":\"transaction_prove\",\"field_level\":\"Transaction Prove\",\"type\":\"file\",\"validation\":\"required\"},\"your_address\":{\"field_name\":\"your_address\",\"field_level\":\"Your Address\",\"type\":\"textarea\",\"validation\":\"required\"}}', '1-2 hours maximum', '2021-12-17 10:02:14', '2021-12-17 10:02:14');

-- --------------------------------------------------------

--
-- Table structure for table `payout_settings`
--

CREATE TABLE `payout_settings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `monday` tinyint(1) DEFAULT NULL,
  `tuesday` tinyint(1) DEFAULT NULL,
  `wednesday` tinyint(1) DEFAULT NULL,
  `thursday` tinyint(1) DEFAULT NULL,
  `friday` tinyint(1) DEFAULT NULL,
  `saturday` tinyint(1) DEFAULT NULL,
  `sunday` tinyint(1) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `payout_settings`
--

INSERT INTO `payout_settings` (`id`, `monday`, `tuesday`, `wednesday`, `thursday`, `friday`, `saturday`, `sunday`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 1, 1, 1, 1, 1, '2022-12-08 08:16:48', '2022-12-17 00:08:24');

-- --------------------------------------------------------

--
-- Table structure for table `rankings`
--

CREATE TABLE `rankings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `rank_name` varchar(255) DEFAULT NULL,
  `rank_lavel` varchar(255) DEFAULT NULL,
  `rank_lavel_unq` varchar(20) DEFAULT NULL,
  `min_invest` decimal(8,2) NOT NULL DEFAULT 0.00,
  `min_deposit` decimal(8,2) NOT NULL DEFAULT 0.00,
  `min_earning` decimal(8,2) NOT NULL DEFAULT 0.00,
  `description` varchar(255) DEFAULT NULL,
  `rank_icon` text DEFAULT NULL,
  `sort_by` int(11) DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `rankings`
--

INSERT INTO `rankings` (`id`, `rank_name`, `rank_lavel`, `rank_lavel_unq`, `min_invest`, `min_deposit`, `min_earning`, `description`, `rank_icon`, `sort_by`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Hyip Member', 'Lavel 1', 'Lavel1', '20.00', '50.00', '5.00', 'By signing up to the account', '63b2b750d51921672656720.png', 1, 1, '2022-12-29 03:01:30', '2023-01-06 05:24:13'),
(2, 'Hyip Leader', 'Lavel 2', 'Lavel2', '50.00', '100.00', '15.00', 'By earning $15 from the site', '63b2b7599a21e1672656729.png', 2, 1, '2022-12-29 03:03:16', '2023-01-06 05:24:13'),
(3, 'Hyip Captain', 'Lavel 3', 'Lavel3', '80.00', '120.00', '25.00', 'By earning $25 from the site', '63b2b76e4ab6b1672656750.png', 3, 1, '2022-12-29 03:04:21', '2023-01-06 05:24:13'),
(4, 'Hyip Victor', 'Lavel 4', 'Lavel4', '100.00', '200.00', '50.00', 'By earning $50 from the site', '63b2b77635d571672656758.png', 4, 1, '2022-12-29 03:05:17', '2023-01-06 05:24:13');

-- --------------------------------------------------------

--
-- Table structure for table `referrals`
--

CREATE TABLE `referrals` (
  `id` int(11) UNSIGNED NOT NULL,
  `commission_type` varchar(30) DEFAULT NULL,
  `level` int(11) NOT NULL,
  `percent` varchar(191) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `referral_bonuses`
--

CREATE TABLE `referral_bonuses` (
  `id` int(11) UNSIGNED NOT NULL,
  `from_user_id` int(11) UNSIGNED DEFAULT NULL,
  `to_user_id` int(11) UNSIGNED DEFAULT NULL,
  `level` int(11) DEFAULT NULL,
  `amount` decimal(18,8) NOT NULL DEFAULT 0.00000000,
  `main_balance` decimal(18,8) NOT NULL DEFAULT 0.00000000,
  `transaction` varchar(20) DEFAULT NULL,
  `type` varchar(10) DEFAULT NULL,
  `remarks` varchar(191) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `site_notifications`
--

CREATE TABLE `site_notifications` (
  `id` int(11) UNSIGNED NOT NULL,
  `site_notificational_id` int(11) NOT NULL,
  `site_notificational_type` varchar(191) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sms_controls`
--

CREATE TABLE `sms_controls` (
  `id` int(11) UNSIGNED NOT NULL,
  `actionMethod` varchar(191) DEFAULT NULL,
  `actionUrl` varchar(191) DEFAULT NULL,
  `headerData` text DEFAULT NULL,
  `paramData` text DEFAULT NULL,
  `formData` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sms_controls`
--

INSERT INTO `sms_controls` (`id`, `actionMethod`, `actionUrl`, `headerData`, `paramData`, `formData`, `created_at`, `updated_at`) VALUES
(1, 'POST', 'https://rest.nexmo.com/sms/json', '{\"Content-Type\":\"application\\/x-www-form-urlencoded\"}', NULL, '{\"from\":\"Rownak\",\"text\":\"[[message]]\",\"to\":\"[[receiver]]\",\"api_key\":\"930cc608\",\"api_secret\":\"2pijsaMOUw5YKOK5\"}', '2021-12-17 10:02:43', '2021-12-17 10:02:43');

-- --------------------------------------------------------

--
-- Table structure for table `subscribers`
--

CREATE TABLE `subscribers` (
  `id` int(11) UNSIGNED NOT NULL,
  `email` varchar(60) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `templates`
--

CREATE TABLE `templates` (
  `id` int(11) UNSIGNED NOT NULL,
  `language_id` int(11) UNSIGNED DEFAULT NULL,
  `section_name` varchar(191) DEFAULT NULL,
  `description` longtext DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `templates`
--

INSERT INTO `templates` (`id`, `language_id`, `section_name`, `description`, `created_at`, `updated_at`) VALUES
(1, 1, 'hero', '{\"title\":\"BEST INVESTMENTS\",\"sub_title\":\"PLAN FOR WORLDWIDE\",\"short_description\":\"A Profitable platform for high-margin investment\",\"button_name\":\"Learn More\"}', '2021-12-17 10:02:59', '2022-08-01 08:11:57'),
(3, 1, 'about-us', '{\"title\":\"ABOUT US\",\"sub_title\":\"Welcome to Hyippro\",\"short_title\":\"Planshyip is an investment company, whose tea working on making money from the volatility of cryptocurrencies and offer great returns to our clients. Icon Missing Secure investments The phrasal sequence of the Lorem Ipsum text is now so widespread that many the starting sequence.\",\"short_description\":\"<p>Lorem, ipsum dolor sit amet consectetur elit. Laboriosam hic impedit. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Tenetur, id!<\\/p><p><br \\/><\\/p><p>Cupiditate laborum ut et minima laudantium doloribus quidem sit non.<\\/p><p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Icon Missing Guaranteed The phrasal sequence of the Lorem Ipsum text is now so widespread that many the starting sequence Icon Missing Secure &amp; Reliable The phrasal sequence of the Lorem Ipsum text is now so widespread that many the starting sequence<\\/p>\"}', '2021-12-17 10:02:59', '2022-12-28 06:44:57'),
(5, 1, 'service', '{\"title\":\"Services\",\"sub_title\":\"WHAT WE DO\",\"short_title\":\"How We\'re Helping\"}', '2021-12-17 10:02:59', '2021-12-17 10:02:59'),
(7, 1, 'call-to-action', '{\"title\":\"We Will Drive More Customers To Your Business Than Any Other Online Source.\",\"sub_title\":\"Multiply your Business\\u2019 Facebook Traffic 10x\",\"button_name\":\"Learn More\"}', '2021-12-17 10:02:59', '2021-12-17 10:02:59'),
(9, 1, 'contact-us', '{\"heading\":\"GET IN TOUCH\",\"sub_heading\":\"Let\'s Ask Your Questions\",\"title\":\"Our Office\",\"address\":\"22 Baker Street, London\",\"email\":\"email@website.com\",\"phone\":\"+44-20-4526-2356\",\"footer_short_details\":\"We are a full service like readable english. Many desktop publishing packages and web page editor now use lorem Ipsum sites still in their.\"}', '2021-12-17 10:02:59', '2021-12-17 10:02:59'),
(11, 1, 'testimonial', '{\"title\":\"TESTIMONIAL\",\"sub_title\":\"Check Our Client Feedback\",\"short_title\":\"Help agencies to define their new business objectives and then create professional software.\"}', '2021-12-17 10:02:59', '2021-12-17 10:02:59'),
(13, 1, 'login', '{\"title\":\"Proclamations About Us\",\"description\":\"<ul>\\r\\n                                    <li>\\r\\n                                        <p>Lorem ipsum dolor sit amet.<\\/p>\\r\\n                                    <\\/li>\\r\\n                                    <li>\\r\\n                                        <p>Adipisicing elit. Beatae, repellendus!<\\/p>\\r\\n                                    <\\/li>\\r\\n                                    <li>\\r\\n                                        <p>Consectetur adipisicing elit. A, eos!<\\/p>\\r\\n                                    <\\/li>\\r\\n                                    <li>\\r\\n                                        <p>Aliquid numquam reiciendis nisi placeat.<\\/p>\\r\\n                                    <\\/li>\\r\\n                                    <li>\\r\\n                                        <p>Voluptas est nesciunt qui necessitatibus<\\/p>\\r\\n                                    <\\/li>\\r\\n                                    <li>\\r\\n                                        <p>Lorem numquam reiciendis nisi placeat.<\\/p>\\r\\n                                    <\\/li><\\/ul>\"}', '2021-12-17 10:02:59', '2021-12-17 10:02:59'),
(15, 1, 'register', '{\"title\":\"Proclamations About Us\",\"description\":\"<ul>\\r\\n                                    <li>\\r\\n                                        <p>Lorem ipsum dolor sit amet.<\\/p>\\r\\n                                    <\\/li>\\r\\n                                    <li>\\r\\n                                        <p>Adipisicing elit. Beatae, repellendus!<\\/p>\\r\\n                                    <\\/li>\\r\\n                                    <li>\\r\\n                                        <p>Consectetur adipisicing elit. A, eos!<\\/p>\\r\\n                                    <\\/li>\\r\\n                                    <li>\\r\\n                                        <p>Aliquid numquam reiciendis nisi placeat.<\\/p>\\r\\n                                    <\\/li>\\r\\n                                    <li>\\r\\n                                        <p>Voluptas est nesciunt qui necessitatibus<\\/p>\\r\\n                                    <\\/li>\\r\\n                                    <li>\\r\\n                                        <p>Lorem numquam reiciendis nisi placeat.<\\/p>\\r\\n                                    <\\/li><\\/ul>\"}', '2021-12-17 10:02:59', '2021-12-17 10:02:59'),
(17, 1, 'forget-password', '{\"title\":\"Proclamations About Us\",\"description\":\"<ul>\\r\\n                                    <li>\\r\\n                                        <p>Lorem ipsum dolor sit amet.<\\/p>\\r\\n                                    <\\/li>\\r\\n                                    <li>\\r\\n                                        <p>Adipisicing elit. Beatae, repellendus!<\\/p>\\r\\n                                    <\\/li>\\r\\n                                    <li>\\r\\n                                        <p>Consectetur adipisicing elit. A, eos!<\\/p>\\r\\n                                    <\\/li>\\r\\n                                    <li>\\r\\n                                        <p>Aliquid numquam reiciendis nisi placeat.<\\/p>\\r\\n                                    <\\/li>\\r\\n                                    <li>\\r\\n                                        <p>Voluptas est nesciunt qui necessitatibus<\\/p>\\r\\n                                    <\\/li>\\r\\n                                    <li>\\r\\n                                        <p>Lorem numquam reiciendis nisi placeat.<\\/p>\\r\\n                                    <\\/li><\\/ul>\"}', '2021-12-17 10:02:59', '2021-12-17 10:02:59'),
(19, 1, 'reset-password', '{\"title\":\"Proclamations About Us\",\"description\":\"<ul>\\r\\n                                    <li>\\r\\n                                        <p>Lorem ipsum dolor sit amet.<\\/p>\\r\\n                                    <\\/li>\\r\\n                                    <li>\\r\\n                                        <p>Adipisicing elit. Beatae, repellendus!<\\/p>\\r\\n                                    <\\/li>\\r\\n                                    <li>\\r\\n                                        <p>Consectetur adipisicing elit. A, eos!<\\/p>\\r\\n                                    <\\/li>\\r\\n                                    <li>\\r\\n                                        <p>Aliquid numquam reiciendis nisi placeat.<\\/p>\\r\\n                                    <\\/li>\\r\\n                                    <li>\\r\\n                                        <p>Voluptas est nesciunt qui necessitatibus<\\/p>\\r\\n                                    <\\/li>\\r\\n                                    <li>\\r\\n                                        <p>Lorem numquam reiciendis nisi placeat.<\\/p>\\r\\n                                    <\\/li><\\/ul>\"}', '2021-12-17 10:02:59', '2021-12-17 10:02:59'),
(21, 1, 'how-it-work', '{\"title\":\"How It Work?\",\"sub_title\":\"PROCESS\",\"short_details\":\"CUPIDITATE LABORUM UT ET MINIMA LAUDANTIUM DOLORIBUS QUIDEM SIT NON.LOREM IPSUM DOLOR SIT AMET CONSECTETUR ADIPISICING ELIT.\"}', '2021-12-17 10:02:59', '2022-07-04 05:56:16'),
(23, 1, 'blog', '{\"title\":\"LATEST POSTS\",\"sub_title\":\"Read Our Blogs\",\"short_title\":\"HELP AGENCIES TO DEFINE THEIR NEW BUSINESS OBJECTIVES AND THEN CREATE PROFESSIONAL SOFTWARE.\"}', '2021-12-17 10:02:59', '2022-07-05 04:50:38'),
(25, 1, 'faq', '{\"title\":\"ANY QUESTIONS\",\"sub_title\":\"We\'ve Got Answers\",\"short_details\":\"Help agencies to define their new business objectives and then create professional software.\"}', '2021-12-17 10:02:59', '2021-12-17 10:02:59'),
(39, 1, 'investment', '{\"title\":\"INVEST OFFER\",\"sub_title\":\"Investment Plans\",\"short_details\":\"Help agencies to define their new business objectives and then create professional software.\"}', '2021-12-17 10:02:59', '2021-12-17 10:02:59'),
(40, 1, 'why-chose-us', '{\"title\":\"CHOOSE INVESTMENT\",\"sub_title\":\"Why Choose Investment Plan\",\"short_details\":\"Help agencies to define their new business objectives and then create professional software.\"}', '2021-12-17 10:02:59', '2021-12-17 10:02:59'),
(41, 1, 'deposit-withdraw', '{\"title\":\"NOT HIDDEN CHARGE\",\"sub_title\":\"Last Deposits &amp; Withdrawals\",\"short_title\":\"Help agencies to define their new business objectives and then create professional software.\"}', '2021-12-17 10:02:59', '2021-12-17 10:02:59'),
(42, 1, 'investor', '{\"title\":\"INVESTOR\",\"sub_title\":\"World Wide Top Investor\",\"short_title\":\"Help agencies to define their new business objectives and then create professional software.\"}', '2021-12-17 10:02:59', '2021-12-17 10:02:59'),
(43, 1, 'news-letter', '{\"title\":\"Subscribe to Newslatter\",\"sub_title\":\"TO GET EXCLUSIVE BENEFITS\"}', '2021-12-17 10:02:59', '2022-05-12 05:50:19'),
(44, 1, 'news-letter-referral', '{\"title\":\"Referral Bonus Level\",\"sub_title\":\"Get On First Level Refferal Commission\",\"referral_title\":\"What You\\u2019ll Get As\",\"referral_sub_title\":\"AN AFFILIATE PARTNER\"}', '2021-12-17 10:02:59', '2022-05-16 00:30:17'),
(45, 1, 'we-accept', '{\"title\":\"PAYMENTS\",\"sub_title\":\"Payments Gateway\",\"short_details\":\"Help agencies to define their new business objectives and then create professional software.\"}', '2021-12-17 10:02:59', '2021-12-17 10:02:59'),
(46, 18, 'hero', '{\"title\":\"MEJORES INVERSIONES\",\"sub_title\":\"PLAN PARA TODO EL MUNDO\",\"short_description\":\"<p>Ponga en pr\\u00e1ctica sus ideas de inversi\\u00f3n con una gama completa de inversiones. Disfrute de beneficios y recompensas reales en su inversi\\u00f3n acumulada.<br \\/><\\/p>\",\"button_name\":\"Aprende m\\u00e1s\"}', '2021-12-17 10:02:59', '2021-12-17 10:02:59'),
(47, 17, 'hero', '{\"title\":\"\\u0938\\u0930\\u094d\\u0935\\u0936\\u094d\\u0930\\u0947\\u0937\\u094d\\u0920 \\u0928\\u093f\\u0935\\u0947\\u0936\",\"sub_title\":\"\\u0926\\u0941\\u0928\\u093f\\u092f\\u093e \\u092d\\u0930 \\u0915\\u0947 \\u0932\\u093f\\u090f \\u092f\\u094b\\u091c\\u0928\\u093e\",\"short_description\":\"<p>\\u092a\\u0942\\u0930\\u0940 \\u0924\\u0930\\u0939 \\u0938\\u0947 \\u0928\\u093f\\u0935\\u0947\\u0936 \\u0915\\u0947 \\u0938\\u093e\\u0925 \\u0905\\u092a\\u0928\\u0947 \\u0928\\u093f\\u0935\\u0947\\u0936 \\u0915\\u0947 \\u0935\\u093f\\u091a\\u093e\\u0930\\u094b\\u0902 \\u0915\\u094b \\u0905\\u092e\\u0932 \\u092e\\u0947\\u0902 \\u0932\\u093e\\u090f\\u0902\\u0964 \\u0905\\u092a\\u0928\\u0947 \\u0928\\u093f\\u0935\\u0947\\u0936 \\u092a\\u0930 \\u0935\\u093e\\u0938\\u094d\\u0924\\u0935\\u093f\\u0915 \\u0932\\u093e\\u092d \\u0914\\u0930 \\u092a\\u0941\\u0930\\u0938\\u094d\\u0915\\u093e\\u0930 \\u0915\\u093e \\u0906\\u0928\\u0902\\u0926 \\u0932\\u0947\\u0902\\u0964<br \\/><\\/p>\",\"button_name\":\"\\u0914\\u0930 \\u0905\\u0927\\u093f\\u0915 \\u091c\\u093e\\u0928\\u0947\\u0902\"}', '2021-12-17 10:02:59', '2021-12-17 10:02:59'),
(48, 18, 'about-us', '{\"title\":\"SOBRE NOSOTROS\",\"sub_title\":\"Bienvenido a Planshyip\",\"short_title\":\"Planshyip es una empresa de inversi\\u00f3n, cuyo t\\u00e9 trabaja para ganar dinero con la volatilidad de las criptomonedas y ofrecer grandes retornos a nuestros clientes.\",\"short_description\":\"<p>\\u00cdcono faltante Inversiones seguras La secuencia de frases del texto de Lorem Ipsum est\\u00e1 ahora tan extendida que muchas de las secuencias iniciales Faltan \\u00edconos Garantizados La secuencia de frases del texto de Lorem Ipsum est\\u00e1 ahora tan extendida que muchas de las secuencias iniciales Faltan icono Seguro y confiable La secuencia de frases de el texto de Lorem Ipsum est\\u00e1 ahora tan extendido que muchas de las secuencias iniciales<br \\/><\\/p>\"}', '2021-12-17 10:02:59', '2021-12-17 10:02:59'),
(49, 17, 'about-us', '{\"title\":\"\\u0939\\u092e\\u093e\\u0930\\u0947 \\u092c\\u093e\\u0930\\u0947 \\u092e\\u0947\\u0902\",\"sub_title\":\"\\u092a\\u094d\\u0932\\u093e\\u0902\\u0936\\u093f\\u092a \\u092e\\u0947\\u0902 \\u0906\\u092a\\u0915\\u093e \\u0938\\u094d\\u0935\\u093e\\u0917\\u0924 \\u0939\\u0948\",\"short_title\":\"\\u092a\\u094d\\u0932\\u093e\\u0902\\u0938\\u0939\\u093f\\u092a \\u090f\\u0915 \\u0928\\u093f\\u0935\\u0947\\u0936 \\u0915\\u0902\\u092a\\u0928\\u0940 \\u0939\\u0948, \\u091c\\u093f\\u0938\\u0915\\u0940 \\u091a\\u093e\\u092f \\u0915\\u094d\\u0930\\u093f\\u092a\\u094d\\u091f\\u094b\\u0915\\u0930\\u0947\\u0902\\u0938\\u0940 \\u0915\\u0940 \\u0905\\u0938\\u094d\\u0925\\u093f\\u0930\\u0924\\u093e \\u0938\\u0947 \\u092a\\u0948\\u0938\\u093e \\u092c\\u0928\\u093e\\u0928\\u0947 \\u092a\\u0930 \\u0915\\u093e\\u092e \\u0915\\u0930\\u0924\\u0940 \\u0939\\u0948 \\u0914\\u0930 \\u0939\\u092e\\u093e\\u0930\\u0947 \\u0917\\u094d\\u0930\\u093e\\u0939\\u0915\\u094b\\u0902 \\u0915\\u094b \\u0936\\u093e\\u0928\\u0926\\u093e\\u0930 \\u0930\\u093f\\u091f\\u0930\\u094d\\u0928 \\u0926\\u0947\\u0924\\u0940 \\u0939\\u0948\\u0964\",\"short_description\":\"<p>\\u0906\\u0907\\u0915\\u0949\\u0928 \\u092e\\u093f\\u0938\\u093f\\u0902\\u0917 \\u0938\\u093f\\u0915\\u094d\\u092f\\u094b\\u0930 \\u0907\\u0928\\u094d\\u0935\\u0947\\u0938\\u094d\\u091f\\u092e\\u0947\\u0902\\u091f \\u0932\\u0949\\u0930\\u0947\\u092e \\u0907\\u092a\\u094d\\u0938\\u092e \\u091f\\u0947\\u0915\\u094d\\u0938\\u094d\\u091f \\u0915\\u093e \\u092e\\u0941\\u0916\\u094d\\u092f \\u0905\\u0928\\u0941\\u0915\\u094d\\u0930\\u092e \\u0905\\u092c \\u0907\\u0924\\u0928\\u093e \\u0935\\u094d\\u092f\\u093e\\u092a\\u0915 \\u0939\\u0948 \\u0915\\u093f \\u0915\\u0908 \\u0936\\u0941\\u0930\\u0941\\u0906\\u0924\\u0940 \\u0938\\u0940\\u0915\\u094d\\u0935\\u0947\\u0902\\u0938 \\u0906\\u0907\\u0915\\u0949\\u0928 \\u092e\\u093f\\u0938\\u093f\\u0902\\u0917 \\u0915\\u0940 \\u0917\\u093e\\u0930\\u0902\\u091f\\u0940 \\u0939\\u0948 \\u0932\\u0949\\u0930\\u0947\\u092e \\u0907\\u092a\\u094d\\u0938\\u092e \\u091f\\u0947\\u0915\\u094d\\u0938\\u094d\\u091f \\u0915\\u093e \\u0939\\u0947\\u0921\\u0938\\u0947\\u0932 \\u0905\\u0928\\u0941\\u0915\\u094d\\u0930\\u092e \\u0905\\u092c \\u0907\\u0924\\u0928\\u093e \\u0935\\u094d\\u092f\\u093e\\u092a\\u0915 \\u0939\\u0948 \\u0915\\u093f \\u0915\\u0908 \\u0936\\u0941\\u0930\\u0941\\u0906\\u0924\\u0940 \\u0938\\u0940\\u0915\\u094d\\u0935\\u0947\\u0902\\u0938 \\u0906\\u0907\\u0915\\u0949\\u0928 \\u092e\\u093f\\u0938\\u093f\\u0902\\u0917 \\u0938\\u093f\\u0915\\u094d\\u092f\\u094b\\u0930 \\u090f\\u0902\\u0921 \\u0930\\u093f\\u0932\\u093e\\u090f\\u092c\\u0932 \\u0938\\u0940\\u091c\\u0947\\u0932 \\u092e\\u093f\\u0938\\u093f\\u0902\\u0917 \\u0905\\u0928\\u0941\\u0915\\u094d\\u0930\\u092e \\u0932\\u094b\\u0930\\u092e \\u0907\\u092a\\u094d\\u0938\\u092e \\u092a\\u093e\\u0920 \\u0905\\u092c \\u0907\\u0924\\u0928\\u093e \\u0935\\u094d\\u092f\\u093e\\u092a\\u0915 \\u0939\\u0948 \\u0915\\u093f \\u0915\\u0908 \\u092a\\u094d\\u0930\\u093e\\u0930\\u0902\\u092d\\u093f\\u0915 \\u0905\\u0928\\u0941\\u0915\\u094d\\u0930\\u092e \\u0939\\u0948\\u0902<br \\/><\\/p>\"}', '2021-12-17 10:02:59', '2021-12-17 10:02:59'),
(50, 17, 'investment', '{\"title\":\"\\u0928\\u093f\\u0935\\u0947\\u0936 \\u0915\\u093e \\u092a\\u094d\\u0930\\u0938\\u094d\\u0924\\u093e\\u0935\",\"sub_title\":\"\\u0928\\u093f\\u0935\\u0947\\u0936 \\u092f\\u094b\\u091c\\u0928\\u093e\",\"short_details\":\"<p>\\u0905\\u092a\\u0928\\u0947 \\u0928\\u090f \\u0935\\u094d\\u092f\\u093e\\u0935\\u0938\\u093e\\u092f\\u093f\\u0915 \\u0909\\u0926\\u094d\\u0926\\u0947\\u0936\\u094d\\u092f\\u094b\\u0902 \\u0915\\u094b \\u092a\\u0930\\u093f\\u092d\\u093e\\u0937\\u093f\\u0924 \\u0915\\u0930\\u0928\\u0947 \\u0914\\u0930 \\u092b\\u093f\\u0930 \\u092a\\u0947\\u0936\\u0947\\u0935\\u0930 \\u0938\\u0949\\u092b\\u093c\\u094d\\u091f\\u0935\\u0947\\u092f\\u0930 \\u092c\\u0928\\u093e\\u0928\\u0947 \\u092e\\u0947\\u0902 \\u090f\\u091c\\u0947\\u0902\\u0938\\u093f\\u092f\\u094b\\u0902 \\u0915\\u0940 \\u0938\\u0939\\u093e\\u092f\\u0924\\u093e \\u0915\\u0930\\u0947\\u0902\\u0964<br \\/><\\/p>\"}', '2021-12-17 10:02:59', '2021-12-17 10:02:59'),
(51, 18, 'investment', '{\"title\":\"OFERTA INVERTIR\",\"sub_title\":\"Planes de inversi\\u00f3n\",\"short_details\":\"<p>Ayude a las agencias a definir sus nuevos objetivos comerciales y luego cree software profesional.<br \\/><\\/p>\"}', '2021-12-17 10:02:59', '2021-12-17 10:02:59'),
(52, 18, 'why-chose-us', '{\"title\":\"ELIGE INVERSI\\u00d3N\",\"sub_title\":\"Por qu\\u00e9 elegir un plan de inversi\\u00f3n\",\"short_details\":\"<p>Ayude a las agencias a definir sus nuevos objetivos comerciales y luego cree software profesional.<br \\/><\\/p>\"}', '2021-12-17 10:02:59', '2021-12-17 10:02:59'),
(53, 17, 'why-chose-us', '{\"title\":\"\\u0935\\u093f\\u0915\\u0932\\u094d\\u092a \\u0928\\u093f\\u0935\\u0947\\u0936\",\"sub_title\":\"\\u0935\\u093f\\u0915\\u0932\\u094d\\u092a \\u0928\\u093f\\u0935\\u0947\\u0936   \\u0915\\u094d\\u092f\\u094b\\u0902 \\u0928\\u093f\\u0935\\u0947\\u0936 \\u092f\\u094b\\u091c\\u0928\\u093e \\u091a\\u0941\\u0928\\u0947\\u0902    \\u0905\\u092a\\u0928\\u0947 \\u0928\\u090f \\u0935\\u094d\\u092f\\u093e\\u0935\\u0938\\u093e\\u092f\\u093f\\u0915 \\u0909\\u0926\\u094d\\u0926\\u0947\\u0936\\u094d\\u092f\\u094b\\u0902 \\u0915\\u094b \\u092a\\u0930\\u093f\\u092d\\u093e\\u0937\\u093f\\u0924 \\u0915\\u0930\\u0928\\u0947 \\u0914\\u0930 \\u092b\\u093f\\u0930 \\u092a\\u0947\\u0936\\u0947\\u0935\\u0930 \\u0938\\u0949\\u092b\\u093c\\u094d\\u091f\\u0935\\u0947\\u092f\\u0930\",\"short_details\":\"<p>\\u0905\\u092a\\u0928\\u0947 \\u0928\\u090f \\u0935\\u094d\\u092f\\u093e\\u0935\\u0938\\u093e\\u092f\\u093f\\u0915 \\u0909\\u0926\\u094d\\u0926\\u0947\\u0936\\u094d\\u092f\\u094b\\u0902 \\u0915\\u094b \\u092a\\u0930\\u093f\\u092d\\u093e\\u0937\\u093f\\u0924 \\u0915\\u0930\\u0928\\u0947 \\u0914\\u0930 \\u092b\\u093f\\u0930 \\u092a\\u0947\\u0936\\u0947\\u0935\\u0930 \\u0938\\u0949\\u092b\\u093c\\u094d\\u091f\\u0935\\u0947\\u092f\\u0930 \\u092c\\u0928\\u093e\\u0928\\u0947 \\u092e\\u0947\\u0902 \\u090f\\u091c\\u0947\\u0902\\u0938\\u093f\\u092f\\u094b\\u0902 \\u0915\\u0940 \\u0938\\u0939\\u093e\\u092f\\u0924\\u093e \\u0915\\u0930\\u0947\\u0902\\u0964<br \\/><\\/p>\"}', '2021-12-17 10:02:59', '2021-12-17 10:02:59'),
(54, 17, 'how-it-work', '{\"title\":\"\\u092f\\u0939 \\u0915\\u0948\\u0938\\u0947 \\u0915\\u093e\\u0930\\u094d\\u092f \\u0915\\u0930\\u0924\\u093e \\u0939\\u0948?\"}', '2021-12-17 10:02:59', '2021-12-17 10:02:59'),
(55, 18, 'how-it-work', '{\"title\":\"\\u00bfComo funciona?\"}', '2021-12-17 10:02:59', '2021-12-17 10:02:59'),
(56, 18, 'deposit-withdraw', '{\"title\":\"CARGA NO OCULTA\",\"sub_title\":\"\\u00daltimos dep\\u00f3sitos y retiros\",\"short_title\":\"Ayude a las agencias a definir sus nuevos objetivos comerciales y luego cree software profesional.\"}', '2021-12-17 10:02:59', '2021-12-17 10:02:59'),
(57, 17, 'deposit-withdraw', '{\"title\":\"\\u091b\\u093f\\u092a\\u093e\\u0908 \\u0928\\u0939\\u0940\\u0902\",\"sub_title\":\"\\u0905\\u0902\\u0924\\u093f\\u092e \\u091c\\u092e\\u093e \\u0914\\u0930 \\u0928\\u093f\\u0915\\u093e\\u0938\\u0940\",\"short_title\":\"\\u0905\\u092a\\u0928\\u0947 \\u0928\\u090f \\u0935\\u094d\\u092f\\u093e\\u0935\\u0938\\u093e\\u092f\\u093f\\u0915 \\u0909\\u0926\\u094d\\u0926\\u0947\\u0936\\u094d\\u092f\\u094b\\u0902 \\u0915\\u094b \\u092a\\u0930\\u093f\\u092d\\u093e\\u0937\\u093f\\u0924 \\u0915\\u0930\\u0928\\u0947 \\u0914\\u0930 \\u092b\\u093f\\u0930 \\u092a\\u0947\\u0936\\u0947\\u0935\\u0930 \\u0938\\u0949\\u092b\\u093c\\u094d\\u091f\\u0935\\u0947\\u092f\\u0930 \\u092c\\u0928\\u093e\\u0928\\u0947 \\u092e\\u0947\\u0902 \\u090f\\u091c\\u0947\\u0902\\u0938\\u093f\\u092f\\u094b\\u0902 \\u0915\\u0940 \\u0938\\u0939\\u093e\\u092f\\u0924\\u093e \\u0915\\u0930\\u0947\\u0902\\u0964\"}', '2021-12-17 10:02:59', '2021-12-17 10:02:59'),
(58, 17, 'testimonial', '{\"title\":\"\\u0917\\u0941\\u0923\\u094b\\u0902 \\u0915\\u093e \\u0935\\u0930\\u094d\\u0923 - \\u092a\\u0924\\u094d\\u0930\",\"sub_title\":\"\\u0939\\u092e\\u093e\\u0930\\u0947 \\u0917\\u094d\\u0930\\u093e\\u0939\\u0915 \\u092a\\u094d\\u0930\\u0924\\u093f\\u0915\\u094d\\u0930\\u093f\\u092f\\u093e \\u0915\\u0940 \\u091c\\u093e\\u0901\\u091a \\u0915\\u0930\\u0947\\u0902\",\"short_title\":\"\\u0905\\u092a\\u0928\\u0947 \\u0928\\u090f \\u0935\\u094d\\u092f\\u093e\\u0935\\u0938\\u093e\\u092f\\u093f\\u0915 \\u0909\\u0926\\u094d\\u0926\\u0947\\u0936\\u094d\\u092f\\u094b\\u0902 \\u0915\\u094b \\u092a\\u0930\\u093f\\u092d\\u093e\\u0937\\u093f\\u0924 \\u0915\\u0930\\u0928\\u0947 \\u0914\\u0930 \\u092b\\u093f\\u0930 \\u092a\\u0947\\u0936\\u0947\\u0935\\u0930 \\u0938\\u0949\\u092b\\u093c\\u094d\\u091f\\u0935\\u0947\\u092f\\u0930 \\u092c\\u0928\\u093e\\u0928\\u0947 \\u092e\\u0947\\u0902 \\u090f\\u091c\\u0947\\u0902\\u0938\\u093f\\u092f\\u094b\\u0902 \\u0915\\u0940 \\u0938\\u0939\\u093e\\u092f\\u0924\\u093e \\u0915\\u0930\\u0947\\u0902\\u0964\"}', '2021-12-17 10:02:59', '2021-12-17 10:02:59'),
(59, 18, 'testimonial', '{\"title\":\"TESTIMONIAL\",\"sub_title\":\"Consulte los comentarios de nuestros clientes\",\"short_title\":\"Ayude a las agencias a definir sus nuevos objetivos comerciales y luego cree software profesional.\"}', '2021-12-17 10:02:59', '2021-12-17 10:02:59'),
(60, 18, 'investor', '{\"title\":\"INVERSOR\",\"sub_title\":\"Mejor inversor mundial\",\"short_title\":\"Ayude a las agencias a definir sus nuevos objetivos comerciales y luego cree software profesional.\"}', '2021-12-17 10:02:59', '2021-12-17 10:02:59'),
(61, 17, 'investor', '{\"title\":\"\\u0907\\u0928\\u094d\\u0935\\u0947\\u0938\\u094d\\u091f\\u0930\",\"sub_title\":\"\\u0935\\u0930\\u094d\\u0932\\u094d\\u0921 \\u0935\\u093e\\u0907\\u0921 \\u0936\\u0940\\u0930\\u094d\\u0937 \\u0928\\u093f\\u0935\\u0947\\u0936\\u0915\",\"short_title\":\"\\u0905\\u092a\\u0928\\u0947 \\u0928\\u090f \\u0935\\u094d\\u092f\\u093e\\u0935\\u0938\\u093e\\u092f\\u093f\\u0915 \\u0909\\u0926\\u094d\\u0926\\u0947\\u0936\\u094d\\u092f\\u094b\\u0902 \\u0915\\u094b \\u092a\\u0930\\u093f\\u092d\\u093e\\u0937\\u093f\\u0924 \\u0915\\u0930\\u0928\\u0947 \\u0914\\u0930 \\u092b\\u093f\\u0930 \\u092a\\u0947\\u0936\\u0947\\u0935\\u0930 \\u0938\\u0949\\u092b\\u093c\\u094d\\u091f\\u0935\\u0947\\u092f\\u0930 \\u092c\\u0928\\u093e\\u0928\\u0947 \\u092e\\u0947\\u0902 \\u090f\\u091c\\u0947\\u0902\\u0938\\u093f\\u092f\\u094b\\u0902 \\u0915\\u0940 \\u0938\\u0939\\u093e\\u092f\\u0924\\u093e \\u0915\\u0930\\u0947\\u0902\\u0964\"}', '2021-12-17 10:02:59', '2021-12-17 10:02:59'),
(62, 17, 'news-letter', '{\"title\":\"\\u0939\\u092e\\u093e\\u0930\\u0947 \\u0938\\u092e\\u093e\\u091a\\u093e\\u0930 \\u092a\\u0924\\u094d\\u0930 \\u0938\\u0947 \\u091c\\u0941\\u0921 \\u091c\\u093e\\u0913\",\"sub_title\":\"\\u092a\\u0942\\u0930\\u094d\\u0923 \\u0928\\u093f\\u0935\\u0947\\u0936 \\u0915\\u0947 \\u0938\\u093e\\u0925 \\u0905\\u092a\\u0928\\u0947 \\u0928\\u093f\\u0935\\u0947\\u0936 \\u0935\\u093f\\u091a\\u093e\\u0930\\u094b\\u0902 \\u0915\\u094b \\u0915\\u093e\\u0930\\u094d\\u092f \\u092e\\u0947\\u0902 \\u0932\\u0917\\u093e\\u090f\\u0902\"}', '2021-12-17 10:02:59', '2021-12-17 10:02:59'),
(63, 18, 'news-letter', '{\"title\":\"Suscr\\u00edbase a nuestro bolet\\u00edn\",\"sub_title\":\"Ponga en pr\\u00e1ctica sus ideas de inversi\\u00f3n con inversiones completas\"}', '2021-12-17 10:02:59', '2021-12-17 10:02:59'),
(64, 17, 'news-letter-referral', '{\"title\":\"\\u0930\\u0947\\u092b\\u0930\\u0932 \\u092c\\u094b\\u0928\\u0938 \\u0938\\u094d\\u0924\\u0930\",\"sub_title\":\"\\u092a\\u0939\\u0932\\u0947 \\u0938\\u094d\\u0924\\u0930 \\u092a\\u0930 \\u0930\\u0947\\u092b\\u0930\\u0932 \\u0915\\u092e\\u0940\\u0936\\u0928 \\u092a\\u094d\\u0930\\u093e\\u092a\\u094d\\u0924 \\u0915\\u0930\\u0947\\u0902\"}', '2021-12-17 10:02:59', '2021-12-17 10:02:59'),
(65, 18, 'news-letter-referral', '{\"title\":\"Nivel de bonificaci\\u00f3n por recomendaci\\u00f3n\",\"sub_title\":\"Sube a la Comisi\\u00f3n de Referencias de Primer Nivel\"}', '2021-12-17 10:02:59', '2021-12-17 10:02:59'),
(66, 17, 'blog', '{\"title\":\"\\u092c\\u094d\\u0932\\u0949\\u0917\",\"sub_title\":\"\\u092a\\u0922\\u093c\\u0947\\u0902 \\u0939\\u092e\\u093e\\u0930\\u093e \\u092c\\u094d\\u0932\\u0949\\u0917\",\"short_title\":\"\\u0905\\u092a\\u0928\\u0947 \\u0928\\u090f \\u0935\\u094d\\u092f\\u093e\\u0935\\u0938\\u093e\\u092f\\u093f\\u0915 \\u0909\\u0926\\u094d\\u0926\\u0947\\u0936\\u094d\\u092f\\u094b\\u0902 \\u0915\\u094b \\u092a\\u0930\\u093f\\u092d\\u093e\\u0937\\u093f\\u0924 \\u0915\\u0930\\u0928\\u0947 \\u0914\\u0930 \\u092b\\u093f\\u0930 \\u092a\\u0947\\u0936\\u0947\\u0935\\u0930 \\u0938\\u0949\\u092b\\u093c\\u094d\\u091f\\u0935\\u0947\\u092f\\u0930 \\u092c\\u0928\\u093e\\u0928\\u0947 \\u092e\\u0947\\u0902 \\u090f\\u091c\\u0947\\u0902\\u0938\\u093f\\u092f\\u094b\\u0902 \\u0915\\u0940 \\u0938\\u0939\\u093e\\u092f\\u0924\\u093e \\u0915\\u0930\\u0947\\u0902\\u0964\"}', '2021-12-17 10:02:59', '2021-12-17 10:02:59'),
(67, 18, 'blog', '{\"title\":\"Blog\",\"sub_title\":\"LEER NUESTRO BLOG\",\"short_title\":\"Ayude a las agencias a definir sus nuevos objetivos comerciales y luego cree software profesional.\"}', '2021-12-17 10:02:59', '2021-12-17 10:02:59'),
(68, 18, 'faq', '{\"title\":\"ALGUNA PREGUNTA\",\"sub_title\":\"Tenemos respuestas\",\"short_details\":\"<p>Ayude a las agencias a definir sus nuevos objetivos comerciales y luego cree software profesional.<br \\/><\\/p>\"}', '2021-12-17 10:02:59', '2021-12-17 10:02:59'),
(69, 17, 'faq', '{\"title\":\"\\u0915\\u094b\\u0908 \\u0938\\u0935\\u093e\\u0932\",\"sub_title\":\"\\u0939\\u092e\\u0947\\u0902 \\u091c\\u0935\\u093e\\u092c \\u092e\\u093f\\u0932 \\u0917\\u092f\\u093e \\u0939\\u0948\",\"short_details\":\"<p>\\u0905\\u092a\\u0928\\u0947 \\u0928\\u090f \\u0935\\u094d\\u092f\\u093e\\u0935\\u0938\\u093e\\u092f\\u093f\\u0915 \\u0909\\u0926\\u094d\\u0926\\u0947\\u0936\\u094d\\u092f\\u094b\\u0902 \\u0915\\u094b \\u092a\\u0930\\u093f\\u092d\\u093e\\u0937\\u093f\\u0924 \\u0915\\u0930\\u0928\\u0947 \\u0914\\u0930 \\u092b\\u093f\\u0930 \\u092a\\u0947\\u0936\\u0947\\u0935\\u0930 \\u0938\\u0949\\u092b\\u093c\\u094d\\u091f\\u0935\\u0947\\u092f\\u0930 \\u092c\\u0928\\u093e\\u0928\\u0947 \\u092e\\u0947\\u0902 \\u090f\\u091c\\u0947\\u0902\\u0938\\u093f\\u092f\\u094b\\u0902 \\u0915\\u0940 \\u0938\\u0939\\u093e\\u092f\\u0924\\u093e \\u0915\\u0930\\u0947\\u0902\\u0964<br \\/><\\/p>\"}', '2021-12-17 10:02:59', '2021-12-17 10:02:59'),
(70, 17, 'we-accept', '{\"title\":\"\\u092d\\u0941\\u0917\\u0924\\u093e\\u0928\",\"sub_title\":\"\\u092d\\u0941\\u0917\\u0924\\u093e\\u0928 \\u0917\\u0947\\u091f\\u0935\\u0947\",\"short_details\":\"<p>\\u0905\\u092a\\u0928\\u0947 \\u0928\\u090f \\u0935\\u094d\\u092f\\u093e\\u0935\\u0938\\u093e\\u092f\\u093f\\u0915 \\u0909\\u0926\\u094d\\u0926\\u0947\\u0936\\u094d\\u092f\\u094b\\u0902 \\u0915\\u094b \\u092a\\u0930\\u093f\\u092d\\u093e\\u0937\\u093f\\u0924 \\u0915\\u0930\\u0928\\u0947 \\u0914\\u0930 \\u092b\\u093f\\u0930 \\u092a\\u0947\\u0936\\u0947\\u0935\\u0930 \\u0938\\u0949\\u092b\\u093c\\u094d\\u091f\\u0935\\u0947\\u092f\\u0930 \\u092c\\u0928\\u093e\\u0928\\u0947 \\u092e\\u0947\\u0902 \\u090f\\u091c\\u0947\\u0902\\u0938\\u093f\\u092f\\u094b\\u0902 \\u0915\\u0940 \\u0938\\u0939\\u093e\\u092f\\u0924\\u093e \\u0915\\u0930\\u0947\\u0902\\u0964<br \\/><\\/p>\"}', '2021-12-17 10:02:59', '2021-12-17 10:02:59'),
(71, 18, 'we-accept', '{\"title\":\"PAGOS\",\"sub_title\":\"Pasarela de pagos\",\"short_details\":\"<p>Ayude a las agencias a definir sus nuevos objetivos comerciales y luego cree software profesional.<br \\/><\\/p>\"}', '2021-12-17 10:02:59', '2021-12-17 10:02:59'),
(72, 18, 'contact-us', '{\"heading\":\"PONERSE EN CONTACTO\",\"sub_heading\":\"Hagamos sus preguntas\",\"title\":\"Nuestra oficina\",\"address\":\"22 Baker Street, Londres\",\"email\":\"email@website.com\",\"phone\":\"+ 44-20-4526-2356\",\"footer_short_details\":\"<p>Somos un servicio completo como el ingl\\u00e9s legible. Muchos paquetes de autoedici\\u00f3n y editor de p\\u00e1ginas web ahora usan sitios lorem Ipsum que todav\\u00eda est\\u00e1n en su.<br \\/><\\/p>\"}', '2021-12-17 10:02:59', '2021-12-17 10:02:59'),
(73, 17, 'contact-us', '{\"heading\":\"\\u0938\\u0902\\u092a\\u0930\\u094d\\u0915 \\u092e\\u0947\\u0902 \\u0930\\u0939\\u094b\",\"sub_heading\":\"\\u0938\\u0902\\u092a\\u0930\\u094d\\u0915 \\u092e\\u0947\\u0902 \\u0930\\u0939\\u094b\",\"title\":\"\\u0915\\u093e\\u0930\\u094d\\u092f\\u093e\\u0932\\u092f\",\"address\":\"22 \\u092c\\u0947\\u0915\\u0930 \\u0938\\u094d\\u091f\\u094d\\u0930\\u0940\\u091f, \\u0932\\u0902\\u0926\\u0928\",\"email\":\"email@website.com\",\"phone\":\"+ 44-20-4526-2356\",\"footer_short_details\":\"<p>\\u0939\\u092e \\u092a\\u0920\\u0928\\u0940\\u092f \\u0905\\u0902\\u0917\\u094d\\u0930\\u0947\\u091c\\u0940 \\u0915\\u0940 \\u0924\\u0930\\u0939 \\u090f\\u0915 \\u092a\\u0942\\u0930\\u094d\\u0923 \\u0938\\u0947\\u0935\\u093e \\u0915\\u0930 \\u0930\\u0939\\u0947 \\u0939\\u0948\\u0902\\u0964 \\u0915\\u0908 \\u0921\\u0947\\u0938\\u094d\\u0915\\u091f\\u0949\\u092a \\u092a\\u092c\\u094d\\u0932\\u093f\\u0936\\u093f\\u0902\\u0917 \\u092a\\u0948\\u0915\\u0947\\u091c \\u0914\\u0930 \\u0935\\u0947\\u092c \\u092a\\u0947\\u091c \\u090f\\u0921\\u093f\\u091f\\u0930 \\u0905\\u092c lorem Ipsum \\u0938\\u093e\\u0907\\u091f\\u094d\\u0938 \\u0915\\u094b \\u0905\\u092d\\u0940 \\u092d\\u0940 \\u0905\\u092a\\u0928\\u0947 \\u092e\\u0947\\u0902 \\u0907\\u0938\\u094d\\u0924\\u0947\\u092e\\u093e\\u0932 \\u0915\\u0930\\u0924\\u0947 \\u0939\\u0948\\u0902\\u0964<br \\/><\\/p>\"}', '2021-12-17 10:02:59', '2021-12-17 10:02:59'),
(74, 19, 'hero', '{\"title\":\"\\u0623\\u0641\\u0636\\u0644 \\u0627\\u0644\\u0627\\u0633\\u062a\\u062b\\u0645\\u0627\\u0631\\u0627\\u062a\",\"sub_title\":\"\\u062e\\u0637\\u0629 \\u0644\\u062c\\u0645\\u064a\\u0639 \\u0623\\u0646\\u062d\\u0627\\u0621 \\u0627\\u0644\\u0639\\u0627\\u0644\\u0645\",\"short_description\":\"\\u0636\\u0639 \\u0623\\u0641\\u0643\\u0627\\u0631\\u0643 \\u0627\\u0644\\u0627\\u0633\\u062a\\u062b\\u0645\\u0627\\u0631\\u064a\\u0629 \\u0645\\u0648\\u0636\\u0639 \\u0627\\u0644\\u062a\\u0646\\u0641\\u064a\\u0630 \\u0645\\u0639 \\u0645\\u062c\\u0645\\u0648\\u0639\\u0629 \\u0643\\u0627\\u0645\\u0644\\u0629 \\u0645\\u0646 \\u0627\\u0644\\u0627\\u0633\\u062a\\u062b\\u0645\\u0627\\u0631\\u0627\\u062a. \\u062a\\u0645\\u062a\\u0639 \\u0628\\u0627\\u0644\\u0645\\u0632\\u0627\\u064a\\u0627 \\u0648\\u0627\\u0644\\u0645\\u0643\\u0627\\u0641\\u0622\\u062a \\u0627\\u0644\\u062d\\u0642\\u064a\\u0642\\u064a\\u0629 \\u0639\\u0644\\u0649 \\u0627\\u0633\\u062a\\u062b\\u0645\\u0627\\u0631\\u0627\\u062a\\u0643 \\u0627\\u0644\\u0645\\u062a\\u0631\\u0627\\u0643\\u0645\\u0629.\",\"button_name\":\"\\u064a\\u062a\\u0639\\u0644\\u0645 \\u0623\\u0643\\u062b\\u0631\"}', '2021-12-17 10:02:59', '2021-12-17 10:02:59'),
(75, 19, 'about-us', '{\"title\":\"\\u0645\\u0639\\u0644\\u0648\\u0645\\u0627\\u062a \\u0639\\u0646\\u0627\",\"sub_title\":\"\\u0645\\u0631\\u062d\\u0628\\u0627 \\u0628\\u0643\\u0645 \\u0641\\u064a \\u0628\\u0644\\u0627\\u0646\\u0634\\u064a\\u0628\",\"short_title\":\"Planshyip \\u0647\\u064a \\u0634\\u0631\\u0643\\u0629 \\u0627\\u0633\\u062a\\u062b\\u0645\\u0627\\u0631\\u064a\\u0629 \\u060c \\u064a\\u0639\\u0645\\u0644 \\u0634\\u0627\\u064a\\u0647\\u0627 \\u0639\\u0644\\u0649 \\u062c\\u0646\\u064a \\u0627\\u0644\\u0623\\u0645\\u0648\\u0627\\u0644 \\u0645\\u0646 \\u062a\\u0642\\u0644\\u0628\\u0627\\u062a \\u0627\\u0644\\u0639\\u0645\\u0644\\u0627\\u062a \\u0627\\u0644\\u0645\\u0634\\u0641\\u0631\\u0629 \\u0648\\u064a\\u0642\\u062f\\u0645 \\u0639\\u0648\\u0627\\u0626\\u062f \\u0643\\u0628\\u064a\\u0631\\u0629 \\u0644\\u0639\\u0645\\u0644\\u0627\\u0626\\u0646\\u0627.\",\"short_description\":\"<p>\\u0627\\u0633\\u062a\\u062b\\u0645\\u0627\\u0631\\u0627\\u062a \\u0622\\u0645\\u0646\\u0629<\\/p><p>\\u0623\\u0635\\u0628\\u062d \\u0627\\u0644\\u062a\\u0633\\u0644\\u0633\\u0644 \\u0627\\u0644\\u0639\\u0628\\u0631\\u064a \\u0644\\u0646\\u0635 \\u0644\\u0648\\u0631\\u064a\\u0645 \\u0625\\u064a\\u0628\\u0633\\u0648\\u0645 \\u0648\\u0627\\u0633\\u0639 \\u0627\\u0644\\u0627\\u0646\\u062a\\u0634\\u0627\\u0631 \\u0627\\u0644\\u0622\\u0646 \\u0644\\u062f\\u0631\\u062c\\u0629 \\u0623\\u0646 \\u0627\\u0644\\u0639\\u062f\\u064a\\u062f \\u0645\\u0646 \\u062a\\u0633\\u0644\\u0633\\u0644 \\u0627\\u0644\\u0628\\u062f\\u0627\\u064a\\u0629<\\/p><p><br \\/><\\/p><p>\\u0645\\u0636\\u0645\\u0648\\u0646<\\/p><p>\\u0623\\u0635\\u0628\\u062d \\u0627\\u0644\\u062a\\u0633\\u0644\\u0633\\u0644 \\u0627\\u0644\\u062c\\u0645\\u0627\\u0644\\u064a \\u0644\\u0646\\u0635 \\u0644\\u0648\\u0631\\u064a\\u0645 \\u0625\\u064a\\u0628\\u0633\\u0648\\u0645 \\u0648\\u0627\\u0633\\u0639 \\u0627\\u0644\\u0627\\u0646\\u062a\\u0634\\u0627\\u0631 \\u0627\\u0644\\u0622\\u0646 \\u0644\\u062f\\u0631\\u062c\\u0629 \\u0623\\u0646 \\u0627\\u0644\\u0639\\u062f\\u064a\\u062f \\u0645\\u0646 \\u062a\\u0633\\u0644\\u0633\\u0644 \\u0627\\u0644\\u0628\\u062f\\u0627\\u064a\\u0629<\\/p><p><br \\/><\\/p><p>\\u0622\\u0645\\u0646 \\u0648\\u0645\\u0648\\u062b\\u0648\\u0642<\\/p><p>\\u0623\\u0635\\u0628\\u062d \\u0627\\u0644\\u062a\\u0633\\u0644\\u0633\\u0644 \\u0627\\u0644\\u0639\\u0628\\u0631\\u064a \\u0644\\u0646\\u0635 \\u0644\\u0648\\u0631\\u064a\\u0645 \\u0625\\u064a\\u0628\\u0633\\u0648\\u0645 \\u0648\\u0627\\u0633\\u0639 \\u0627\\u0644\\u0627\\u0646\\u062a\\u0634\\u0627\\u0631 \\u0627\\u0644\\u0622\\u0646 \\u0644\\u062f\\u0631\\u062c\\u0629 \\u0623\\u0646 \\u0627\\u0644\\u0639\\u062f\\u064a\\u062f \\u0645\\u0646 \\u062a\\u0633\\u0644\\u0633\\u0644 \\u0627\\u0644\\u0628\\u062f\\u0627\\u064a\\u0629<\\/p>\"}', '2021-12-17 10:02:59', '2021-12-17 10:02:59'),
(76, 19, 'investment', '{\"title\":\"\\u0639\\u0631\\u0636 \\u0627\\u0644\\u0627\\u0633\\u062a\\u062b\\u0645\\u0627\\u0631\",\"sub_title\":\"\\u062e\\u0637\\u0637 \\u0627\\u0644\\u0627\\u0633\\u062a\\u062b\\u0645\\u0627\\u0631\",\"short_details\":\"<p>\\u0633\\u0627\\u0639\\u062f \\u0627\\u0644\\u0648\\u0643\\u0627\\u0644\\u0627\\u062a \\u0639\\u0644\\u0649 \\u062a\\u062d\\u062f\\u064a\\u062f \\u0623\\u0647\\u062f\\u0627\\u0641 \\u0623\\u0639\\u0645\\u0627\\u0644\\u0647\\u0627 \\u0627\\u0644\\u062c\\u062f\\u064a\\u062f\\u0629 \\u062b\\u0645 \\u0625\\u0646\\u0634\\u0627\\u0621 \\u0628\\u0631\\u0627\\u0645\\u062c \\u0627\\u062d\\u062a\\u0631\\u0627\\u0641\\u064a\\u0629.<br \\/><\\/p>\"}', '2021-12-17 10:02:59', '2021-12-17 10:02:59'),
(77, 1, 'how-we-work', '{\"title\":\"GET TO KNOW\",\"sub_title\":\"HOW WE WORK?\",\"short_details\":\"worldwide investment company who are committed\"}', '2022-05-11 01:43:21', '2022-05-11 01:56:29'),
(78, 1, 'know-more-us', '{\"title\":\"INVESTON HISTORY\",\"sub_title\":\"KNOW MORE US\",\"short_details\":\"Help agencies to define their new business objectives and then create professional software.\"}', '2022-05-11 03:10:19', '2022-05-11 03:10:19'),
(79, 1, 'calculate-profit', '{\"title\":\"PLANS CALCULATOR\",\"sub_title\":\"CALCULATE THE AMAZING PROFITS\",\"short_details\":\"worldwide investment company who are committed provides a straight forward and transparent mechanism\",\"profit_title\":\"YOUR PROFIT\",\"profit_sub_title\":\"Calculate how much your invest profit\"}', '2022-05-16 00:48:16', '2022-05-16 00:48:16'),
(80, 1, 'request-a-call', '{\"title\":\"Why We are always ready\",\"sub_title\":\"REQUEST A CALL BACK\",\"button_name\":\"CONTACT SUPPORT\"}', '2022-05-17 01:03:05', '2022-05-17 01:03:05');

-- --------------------------------------------------------

--
-- Table structure for table `template_media`
--

CREATE TABLE `template_media` (
  `id` int(11) UNSIGNED NOT NULL,
  `section_name` varchar(191) DEFAULT NULL,
  `description` longtext DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `template_media`
--

INSERT INTO `template_media` (`id`, `section_name`, `description`, `created_at`, `updated_at`) VALUES
(1, 'hero', '{\"image\":\"63ac0f188d1e71672220440.png\",\"background_image\":\"62e7df341d6fe1659363124.jpg\",\"button_link\":\"https:\\/\\/bugfinder.net\\/\"}', '2021-12-17 10:02:53', '2022-12-28 03:40:41'),
(2, 'about-us', '{\"image\":\"63ac0ff74380e1672220663.png\",\"youtube_link\":\"https:\\/\\/www.youtube.com\\/embed\\/LXb3EKWsInQ?controls=0\"}', '2021-12-17 10:02:53', '2022-12-28 03:44:23'),
(3, 'call-to-action', '{\"image\":\"60193254de30d1612264020.png\",\"button_link\":\"http:\\/\\/localhost\\/smm\\/admin\\/content-show\\/4\"}', '2021-12-17 10:02:53', '2021-12-17 10:02:53'),
(4, 'how-it-work', '{\"image\":\"6059d2c2654921616499394.jpg\",\"youtube_link\":\"https:\\/\\/www.youtube.com\\/embed\\/LXb3EKWsInQ?controls=0\"}', '2021-12-17 10:02:53', '2021-12-17 10:02:53'),
(5, 'request-a-call', '{\"button_link\":\"http:\\/\\/localhost\\/hyip_pro\\/contact\"}', '2022-05-17 01:03:05', '2022-05-17 01:03:05'),
(6, 'contact-us', '{\"image\":\"62c2c2a5318e21656930981.png\"}', '2022-07-04 04:36:21', '2022-07-04 04:36:21');

-- --------------------------------------------------------

--
-- Table structure for table `tickets`
--

CREATE TABLE `tickets` (
  `id` int(11) UNSIGNED NOT NULL,
  `user_id` int(11) UNSIGNED DEFAULT NULL,
  `name` varchar(191) DEFAULT NULL,
  `email` varchar(91) DEFAULT NULL,
  `ticket` varchar(191) DEFAULT NULL,
  `subject` varchar(191) DEFAULT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 0 COMMENT '0: Open, 1: Answered, 2: Replied, 3: Closed	',
  `last_reply` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ticket_attachments`
--

CREATE TABLE `ticket_attachments` (
  `id` int(11) UNSIGNED NOT NULL,
  `ticket_message_id` int(11) UNSIGNED DEFAULT NULL,
  `image` varchar(191) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ticket_messages`
--

CREATE TABLE `ticket_messages` (
  `id` int(11) UNSIGNED NOT NULL,
  `ticket_id` int(11) UNSIGNED DEFAULT NULL,
  `admin_id` int(11) UNSIGNED DEFAULT NULL,
  `message` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` int(11) UNSIGNED NOT NULL,
  `user_id` int(11) NOT NULL,
  `amount` double(11,2) DEFAULT NULL,
  `charge` decimal(11,2) NOT NULL DEFAULT 0.00,
  `final_balance` varchar(30) DEFAULT NULL,
  `trx_type` varchar(10) DEFAULT NULL,
  `balance_type` varchar(20) DEFAULT NULL,
  `remarks` varchar(191) NOT NULL,
  `trx_id` varchar(50) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) UNSIGNED NOT NULL,
  `firstname` varchar(60) DEFAULT NULL,
  `lastname` varchar(60) DEFAULT NULL,
  `username` varchar(60) DEFAULT NULL,
  `referral_id` int(11) DEFAULT NULL,
  `language_id` int(11) DEFAULT NULL,
  `email` varchar(191) DEFAULT NULL,
  `country_code` varchar(20) DEFAULT NULL,
  `phone_code` varchar(20) DEFAULT NULL,
  `phone` varchar(91) DEFAULT NULL,
  `balance` decimal(11,2) NOT NULL DEFAULT 0.00,
  `interest_balance` decimal(11,2) NOT NULL DEFAULT 0.00,
  `total_invest` decimal(11,2) NOT NULL DEFAULT 0.00,
  `total_deposit` decimal(11,2) NOT NULL DEFAULT 0.00,
  `total_interest_balance` decimal(11,2) NOT NULL DEFAULT 0.00,
  `admin_update_badge` int(11) NOT NULL DEFAULT 0,
  `last_lavel` varchar(191) DEFAULT NULL,
  `image` varchar(191) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `provider` varchar(191) DEFAULT NULL,
  `provider_id` varchar(191) DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `two_fa` tinyint(1) NOT NULL DEFAULT 0 COMMENT '0: two-FA off, 1: two-FA on',
  `two_fa_verify` tinyint(1) NOT NULL DEFAULT 1 COMMENT '0: two-FA unverified, 1: two-FA verified',
  `two_fa_code` varchar(50) DEFAULT NULL,
  `email_verification` tinyint(1) NOT NULL DEFAULT 1,
  `sms_verification` tinyint(1) NOT NULL DEFAULT 1,
  `verify_code` varchar(50) DEFAULT NULL,
  `sent_at` datetime DEFAULT NULL,
  `last_login` datetime DEFAULT NULL,
  `password` varchar(191) DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `remember_token` varchar(191) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `identity_verify` tinyint(4) NOT NULL COMMENT '	0 => Not Applied, 1=> Applied, 2=> Approved, 3 => Rejected	',
  `address_verify` tinyint(4) NOT NULL COMMENT '0 => Not Applied, 1=> Applied, 2=> Approved, 3 => Rejected	'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `admins_email_unique` (`email`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `configures`
--
ALTER TABLE `configures`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `contents`
--
ALTER TABLE `contents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `contents_name_index` (`name`);

--
-- Indexes for table `content_details`
--
ALTER TABLE `content_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `content_details_content_id_foreign` (`content_id`),
  ADD KEY `content_details_language_id_foreign` (`language_id`);

--
-- Indexes for table `content_media`
--
ALTER TABLE `content_media`
  ADD PRIMARY KEY (`id`),
  ADD KEY `content_media_content_id_foreign` (`content_id`);

--
-- Indexes for table `email_templates`
--
ALTER TABLE `email_templates`
  ADD PRIMARY KEY (`id`),
  ADD KEY `email_templates_language_id_foreign` (`language_id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `funds`
--
ALTER TABLE `funds`
  ADD PRIMARY KEY (`id`),
  ADD KEY `funds_user_id_foreign` (`user_id`),
  ADD KEY `funds_gateway_id_foreign` (`gateway_id`);

--
-- Indexes for table `gateways`
--
ALTER TABLE `gateways`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `gateways_code_unique` (`code`);

--
-- Indexes for table `identify_forms`
--
ALTER TABLE `identify_forms`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `investments`
--
ALTER TABLE `investments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `kycs`
--
ALTER TABLE `kycs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `languages`
--
ALTER TABLE `languages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `manage_plans`
--
ALTER TABLE `manage_plans`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `manage_times`
--
ALTER TABLE `manage_times`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `money_transfers`
--
ALTER TABLE `money_transfers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notify_templates`
--
ALTER TABLE `notify_templates`
  ADD PRIMARY KEY (`id`),
  ADD KEY `notify_templates_language_id_foreign` (`language_id`);

--
-- Indexes for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD KEY `password_resets_email_index` (`email`);

--
-- Indexes for table `payout_logs`
--
ALTER TABLE `payout_logs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `payout_methods`
--
ALTER TABLE `payout_methods`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `payout_settings`
--
ALTER TABLE `payout_settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `rankings`
--
ALTER TABLE `rankings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `referrals`
--
ALTER TABLE `referrals`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `referral_bonuses`
--
ALTER TABLE `referral_bonuses`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `site_notifications`
--
ALTER TABLE `site_notifications`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sms_controls`
--
ALTER TABLE `sms_controls`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `subscribers`
--
ALTER TABLE `subscribers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `templates`
--
ALTER TABLE `templates`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `template_media`
--
ALTER TABLE `template_media`
  ADD PRIMARY KEY (`id`),
  ADD KEY `template_media_section_name_index` (`section_name`);

--
-- Indexes for table `tickets`
--
ALTER TABLE `tickets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tickets_user_id_foreign` (`user_id`);

--
-- Indexes for table `ticket_attachments`
--
ALTER TABLE `ticket_attachments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ticket_attachments_ticket_message_id_foreign` (`ticket_message_id`);

--
-- Indexes for table `ticket_messages`
--
ALTER TABLE `ticket_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ticket_messages_ticket_id_foreign` (`ticket_id`),
  ADD KEY `ticket_messages_admin_id_foreign` (`admin_id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `configures`
--
ALTER TABLE `configures`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `contents`
--
ALTER TABLE `contents`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=88;

--
-- AUTO_INCREMENT for table `content_details`
--
ALTER TABLE `content_details`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=230;

--
-- AUTO_INCREMENT for table `content_media`
--
ALTER TABLE `content_media`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

--
-- AUTO_INCREMENT for table `email_templates`
--
ALTER TABLE `email_templates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `funds`
--
ALTER TABLE `funds`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `gateways`
--
ALTER TABLE `gateways`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1001;

--
-- AUTO_INCREMENT for table `identify_forms`
--
ALTER TABLE `identify_forms`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `investments`
--
ALTER TABLE `investments`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `kycs`
--
ALTER TABLE `kycs`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `languages`
--
ALTER TABLE `languages`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `manage_plans`
--
ALTER TABLE `manage_plans`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `manage_times`
--
ALTER TABLE `manage_times`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=112;

--
-- AUTO_INCREMENT for table `money_transfers`
--
ALTER TABLE `money_transfers`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notify_templates`
--
ALTER TABLE `notify_templates`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

--
-- AUTO_INCREMENT for table `payout_logs`
--
ALTER TABLE `payout_logs`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payout_methods`
--
ALTER TABLE `payout_methods`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `payout_settings`
--
ALTER TABLE `payout_settings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `rankings`
--
ALTER TABLE `rankings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `referrals`
--
ALTER TABLE `referrals`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `referral_bonuses`
--
ALTER TABLE `referral_bonuses`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `site_notifications`
--
ALTER TABLE `site_notifications`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sms_controls`
--
ALTER TABLE `sms_controls`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `subscribers`
--
ALTER TABLE `subscribers`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `templates`
--
ALTER TABLE `templates`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=81;

--
-- AUTO_INCREMENT for table `template_media`
--
ALTER TABLE `template_media`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `tickets`
--
ALTER TABLE `tickets`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ticket_attachments`
--
ALTER TABLE `ticket_attachments`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ticket_messages`
--
ALTER TABLE `ticket_messages`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `content_details`
--
ALTER TABLE `content_details`
  ADD CONSTRAINT `content_details_content_id_foreign` FOREIGN KEY (`content_id`) REFERENCES `contents` (`id`),
  ADD CONSTRAINT `content_details_language_id_foreign` FOREIGN KEY (`language_id`) REFERENCES `languages` (`id`);

--
-- Constraints for table `content_media`
--
ALTER TABLE `content_media`
  ADD CONSTRAINT `content_media_content_id_foreign` FOREIGN KEY (`content_id`) REFERENCES `contents` (`id`);

--
-- Constraints for table `email_templates`
--
ALTER TABLE `email_templates`
  ADD CONSTRAINT `email_templates_language_id_foreign` FOREIGN KEY (`language_id`) REFERENCES `languages` (`id`);

--
-- Constraints for table `funds`
--
ALTER TABLE `funds`
  ADD CONSTRAINT `funds_gateway_id_foreign` FOREIGN KEY (`gateway_id`) REFERENCES `gateways` (`id`),
  ADD CONSTRAINT `funds_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `notify_templates`
--
ALTER TABLE `notify_templates`
  ADD CONSTRAINT `notify_templates_language_id_foreign` FOREIGN KEY (`language_id`) REFERENCES `languages` (`id`);

--
-- Constraints for table `tickets`
--
ALTER TABLE `tickets`
  ADD CONSTRAINT `tickets_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `ticket_attachments`
--
ALTER TABLE `ticket_attachments`
  ADD CONSTRAINT `ticket_attachments_ticket_message_id_foreign` FOREIGN KEY (`ticket_message_id`) REFERENCES `ticket_messages` (`id`);

--
-- Constraints for table `ticket_messages`
--
ALTER TABLE `ticket_messages`
  ADD CONSTRAINT `ticket_messages_admin_id_foreign` FOREIGN KEY (`admin_id`) REFERENCES `admins` (`id`),
  ADD CONSTRAINT `ticket_messages_ticket_id_foreign` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
