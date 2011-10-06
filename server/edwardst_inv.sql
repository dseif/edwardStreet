-- phpMyAdmin SQL Dump
-- version 3.4.5
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Sep 19, 2011 at 10:13 AM
-- Server version: 5.1.58
-- PHP Version: 5.2.9

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `edwardst_inv`
--

-- --------------------------------------------------------

--
-- Table structure for table `CONTACT_PERSON`
--

DROP TABLE IF EXISTS `CONTACT_PERSON`;
CREATE TABLE IF NOT EXISTS `CONTACT_PERSON` (
  `CONTACT_PERSON_ID` int(10) NOT NULL AUTO_INCREMENT,
  `SUPPLIER_ID` int(10) NOT NULL,
  `LAST_NAME` varchar(30) NOT NULL,
  `FIRST_NAME` varchar(30) DEFAULT NULL,
  `PHONE_NUMBER` char(10) DEFAULT NULL,
  PRIMARY KEY (`CONTACT_PERSON_ID`),
  KEY `SUPPLIER_ID` (`SUPPLIER_ID`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `DATES_OF_DELIVERY`
--

DROP TABLE IF EXISTS `DATES_OF_DELIVERY`;
CREATE TABLE IF NOT EXISTS `DATES_OF_DELIVERY` (
  `SUPPLIER_ID` int(10) NOT NULL,
  `DAY_NUMBER` int(1) NOT NULL,
  PRIMARY KEY (`SUPPLIER_ID`,`DAY_NUMBER`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `ITEM`
--

DROP TABLE IF EXISTS `ITEM`;
CREATE TABLE IF NOT EXISTS `ITEM` (
  `ITEM_ID` char(8) NOT NULL,
  `DIST_CODE` varchar(15) DEFAULT NULL,
  `ITEM_NAME` varchar(30) NOT NULL,
  `RECEIPT_NAME` varchar(10) DEFAULT NULL,
  `CATEGORY` varchar(20) DEFAULT NULL,
  `UNIT` varchar(10) DEFAULT NULL,
  `ITEM_TYPE` varchar(10) NOT NULL,
  `COMMENT` text,
  `LATEST_PRICE` int(10) DEFAULT NULL,
  PRIMARY KEY (`ITEM_ID`),
  UNIQUE KEY `ITEM_NAME` (`ITEM_NAME`),
  UNIQUE KEY `RECEIPT_NAME` (`RECEIPT_NAME`),
  KEY `CATEGORY` (`CATEGORY`),
  KEY `LATEST_PRICE` (`LATEST_PRICE`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `ITEM_CATEGORY`
--

DROP TABLE IF EXISTS `ITEM_CATEGORY`;
CREATE TABLE IF NOT EXISTS `ITEM_CATEGORY` (
  `CAT_NAME` varchar(20) NOT NULL,
  `COMMENT` text,
  PRIMARY KEY (`CAT_NAME`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `ITEM_HISTORY`
--

DROP TABLE IF EXISTS `ITEM_HISTORY`;
CREATE TABLE IF NOT EXISTS `ITEM_HISTORY` (
  `ENTRY_ID` int(10) NOT NULL AUTO_INCREMENT,
  `ITEM_ID` char(8) NOT NULL,
  `CATEGORY` varchar(10) NOT NULL,
  `COMMENT` text,
  `AUTHOR` varchar(20) NOT NULL,
  `LOG_DATE` datetime DEFAULT NULL,
  PRIMARY KEY (`ENTRY_ID`),
  KEY `ITEM_ID` (`ITEM_ID`),
  KEY `AUTHOR` (`AUTHOR`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `ITEM_SUPPLIER`
--

DROP TABLE IF EXISTS `ITEM_SUPPLIER`;
CREATE TABLE IF NOT EXISTS `ITEM_SUPPLIER` (
  `ITEM_ID` char(8) NOT NULL,
  `SUPPLIER_ID` int(10) NOT NULL,
  PRIMARY KEY (`ITEM_ID`,`SUPPLIER_ID`),
  KEY `SUPPLIER_ID` (`SUPPLIER_ID`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `PO_HISTORY`
--

DROP TABLE IF EXISTS `PO_HISTORY`;
CREATE TABLE IF NOT EXISTS `PO_HISTORY` (
  `ENTRY_ID` int(10) NOT NULL AUTO_INCREMENT,
  `PO_ID` int(10) NOT NULL,
  `CATEGORY` varchar(10) NOT NULL,
  `COMMENT` text,
  `AUTHOR` varchar(20) NOT NULL,
  `LOG_DATE` datetime DEFAULT NULL,
  PRIMARY KEY (`ENTRY_ID`),
  KEY `PO_ID` (`PO_ID`),
  KEY `AUTHOR` (`AUTHOR`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `PO_LINE`
--

DROP TABLE IF EXISTS `PO_LINE`;
CREATE TABLE IF NOT EXISTS `PO_LINE` (
  `PO_ID` int(10) NOT NULL,
  `PO_LINE_ID` int(3) NOT NULL,
  `ITEM_ID` char(8) NOT NULL,
  `QTY_ORDERED` int(10) NOT NULL,
  `QTY_RECEIVED` int(10) DEFAULT NULL,
  `COMMENT` text,
  `AUTHOR` varchar(20) NOT NULL,
  `PRICE_ID` int(10) NOT NULL,
  PRIMARY KEY (`PO_ID`,`PO_LINE_ID`),
  KEY `ITEM_ID` (`ITEM_ID`),
  KEY `AUTHOR` (`AUTHOR`),
  KEY `PRICE_ID` (`PRICE_ID`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `PRICE_HISTORY`
--

DROP TABLE IF EXISTS `PRICE_HISTORY`;
CREATE TABLE IF NOT EXISTS `PRICE_HISTORY` (
  `PRICE_ID` int(10) NOT NULL AUTO_INCREMENT,
  `ITEM_ID` char(8) NOT NULL,
  `SUPPLIER_ID` int(10) NOT NULL,
  `PRICE` decimal(8,2) NOT NULL,
  `AUTHOR` varchar(20) NOT NULL,
  `LOG_DATE` datetime DEFAULT NULL,
  PRIMARY KEY (`PRICE_ID`),
  KEY `ITEM_ID` (`ITEM_ID`),
  KEY `SUPPLIER_ID` (`SUPPLIER_ID`),
  KEY `AUTHOR` (`AUTHOR`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `PURCHASE_ORDER`
--

DROP TABLE IF EXISTS `PURCHASE_ORDER`;
CREATE TABLE IF NOT EXISTS `PURCHASE_ORDER` (
  `PO_ID` int(10) NOT NULL AUTO_INCREMENT,
  `STATUS` char(10) NOT NULL,
  `CREATE_DATE` datetime DEFAULT NULL,
  `SUBMIT_DATE` datetime DEFAULT NULL,
  `DELIVERY_DATE` date DEFAULT NULL,
  `DELIVERY_TIME` char(10) DEFAULT NULL,
  `RECEIVE_DATE` datetime DEFAULT NULL,
  `REF_NUMBER` varchar(10) DEFAULT NULL,
  `COMMENT` text,
  `SUPPLIER_ID` int(10) DEFAULT NULL,
  PRIMARY KEY (`PO_ID`),
  KEY `SUPPLIER_ID` (`SUPPLIER_ID`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `RETURN_LINE`
--

DROP TABLE IF EXISTS `RETURN_LINE`;
CREATE TABLE IF NOT EXISTS `RETURN_LINE` (
  `PO_ID` int(10) NOT NULL,
  `RETURN_LINE_ID` int(3) NOT NULL,
  `PO_LINE_ID` int(3) NOT NULL,
  `RETURN_DATE` date NOT NULL,
  `QTY_RETURNED` int(10) NOT NULL,
  `CREDIT_MEMO_NUM` varchar(20) DEFAULT NULL,
  `COMMENT` text,
  `AUTHOR` varchar(20) NOT NULL,
  PRIMARY KEY (`PO_ID`,`RETURN_LINE_ID`),
  KEY `PO_LINE_ID` (`PO_LINE_ID`),
  KEY `AUTHOR` (`AUTHOR`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `SUPPLIER`
--

DROP TABLE IF EXISTS `SUPPLIER`;
CREATE TABLE IF NOT EXISTS `SUPPLIER` (
  `SUPPLIER_ID` int(10) NOT NULL AUTO_INCREMENT,
  `NAME` varchar(50) NOT NULL,
  `LEGAL_NAME` varchar(50) DEFAULT NULL,
  `LEAD_TIME` int(3) DEFAULT NULL,
  `SUPPLIER_COMMENT` text,
  `SPECIAL_COMMENT` text,
  PRIMARY KEY (`SUPPLIER_ID`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `SUPPLIER_ADDRESS`
--

DROP TABLE IF EXISTS `SUPPLIER_ADDRESS`;
CREATE TABLE IF NOT EXISTS `SUPPLIER_ADDRESS` (
  `ADDRESS_ID` int(10) NOT NULL AUTO_INCREMENT,
  `SUPPLIER_ID` int(10) NOT NULL,
  `ADDRESS_LINE_1` varchar(50) DEFAULT NULL,
  `ADDRESS_LINE_2` varchar(50) DEFAULT NULL,
  `CITY` varchar(50) DEFAULT NULL,
  `PROV_STATE` varchar(30) DEFAULT NULL,
  `COUNTRY` varchar(30) DEFAULT NULL,
  `POSTAL_ZIP` varchar(10) DEFAULT NULL,
  `PHONE_NUMBER` char(10) DEFAULT NULL,
  PRIMARY KEY (`ADDRESS_ID`),
  KEY `SUPPLIER_ID` (`SUPPLIER_ID`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `SUPPLIER_HISTORY`
--

DROP TABLE IF EXISTS `SUPPLIER_HISTORY`;
CREATE TABLE IF NOT EXISTS `SUPPLIER_HISTORY` (
  `ENTRY_ID` int(10) NOT NULL AUTO_INCREMENT,
  `SUPPLIER_ID` int(10) NOT NULL,
  `CATEGORY` varchar(10) NOT NULL,
  `COMMENT` text,
  `AUTHOR` varchar(20) NOT NULL,
  `LOG_DATE` datetime DEFAULT NULL,
  PRIMARY KEY (`ENTRY_ID`),
  KEY `SUPPLIER_ID` (`SUPPLIER_ID`),
  KEY `AUTHOR` (`AUTHOR`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `USER`
--

DROP TABLE IF EXISTS `USER`;
CREATE TABLE IF NOT EXISTS `USER` (
  `USER_ID` varchar(20) NOT NULL,
  `PASSWORD` char(32) NOT NULL,
  `EMAIL` varchar(40) DEFAULT NULL,
  `EMPLOYEE_ID` varchar(20) DEFAULT NULL,
  `ROLE` varchar(20) NOT NULL,
  PRIMARY KEY (`USER_ID`),
  KEY `ROLE` (`ROLE`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `USER`
--

INSERT INTO `USER` (`USER_ID`, `PASSWORD`, `EMAIL`, `EMPLOYEE_ID`, `ROLE`) VALUES
('apex_admin', '', 'apex_admin@edwardstreet.ca', '000A', 'Administrator'),
('apex_buyer', '', 'apex_buyer@edwardstreet.ca', '000B', 'Buyer'),
('apex_receiver', '', 'apex_receiver@edwardstreet.ca', '000R', 'Receiver'),
('apex_supplier', '', 'apex_supplier@edwardstreet.ca', '000S', 'Supplier');

-- --------------------------------------------------------

--
-- Table structure for table `USER_HISTORY`
--

DROP TABLE IF EXISTS `USER_HISTORY`;
CREATE TABLE IF NOT EXISTS `USER_HISTORY` (
  `ENTRY_ID` int(10) NOT NULL AUTO_INCREMENT,
  `USER_ID` varchar(20) NOT NULL,
  `CATEGORY` varchar(10) NOT NULL,
  `COMMENT` text,
  `AUTHOR` varchar(20) NOT NULL,
  `LOG_DATE` datetime DEFAULT NULL,
  PRIMARY KEY (`ENTRY_ID`),
  KEY `USER_ID` (`USER_ID`),
  KEY `AUTHOR` (`AUTHOR`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `USER_ROLE`
--

DROP TABLE IF EXISTS `USER_ROLE`;
CREATE TABLE IF NOT EXISTS `USER_ROLE` (
  `ROLE_NAME` varchar(20) NOT NULL,
  PRIMARY KEY (`ROLE_NAME`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `USER_ROLE`
--

INSERT INTO `USER_ROLE` (`ROLE_NAME`) VALUES
('Administrator'),
('Buyer'),
('Receiver'),
('Supplier');

-- --------------------------------------------------------

--
-- Table structure for table `WEEKDAY`
--

DROP TABLE IF EXISTS `WEEKDAY`;
CREATE TABLE IF NOT EXISTS `WEEKDAY` (
  `DAY_NUMBER` int(1) NOT NULL,
  `DAY_NAME` varchar(10) NOT NULL,
  `ABBREVIATION` varchar(5) NOT NULL,
  PRIMARY KEY (`DAY_NUMBER`),
  UNIQUE KEY `DAY_NAME` (`DAY_NAME`),
  UNIQUE KEY `ABBREVIATION` (`ABBREVIATION`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `WEEKDAY`
--

INSERT INTO `WEEKDAY` (`DAY_NUMBER`, `DAY_NAME`, `ABBREVIATION`) VALUES
(1, 'Monday', 'MON'),
(2, 'Tuesday', 'TUE'),
(3, 'Wednesday', 'WED'),
(4, 'Thusday', 'THR'),
(5, 'Friday', 'FRI'),
(6, 'Saturday', 'SAT'),
(7, 'Sunday', 'SUN');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
