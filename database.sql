CREATE TABLE course (
  cid int(11) NOT NULL AUTO_INCREMENT,
  cname varchar(100) DEFAULT NULL,
  ccode varchar(45) DEFAULT NULL,
  credits decimal(3,1) DEFAULT NULL,
  class varchar(45) DEFAULT NULL,
  program_year int(11) DEFAULT NULL,
  PRIMARY KEY (cid)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;

CREATE TABLE course_instance (
  ciid int(11) NOT NULL AUTO_INCREMENT,
  cid int(11) NOT NULL,
  coordinator int(11) NOT NULL,
  examiner int(11) NOT NULL,
  start_period varchar(3) DEFAULT NULL,
  end_period varchar(3) DEFAULT NULL,
  year varchar(4) DEFAULT NULL,
  students int(11) DEFAULT NULL,
  study_program varchar(100) DEFAULT NULL,
  planner int(11) DEFAULT NULL,
  PRIMARY KEY (ciid)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;

CREATE TABLE teacher (
  tid int(11) NOT NULL AUTO_INCREMENT,
  fname varchar(100) DEFAULT NULL,
  lname varchar(100) DEFAULT NULL,
  sign varchar(5) DEFAULT NULL,
  PRIMARY KEY (tid)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;

CREATE TABLE teaching (
  teid int(11) NOT NULL AUTO_INCREMENT,
  teacher int(11) DEFAULT NULL,
  ciid int(11) DEFAULT NULL,
  hours int(11) DEFAULT NULL,
  status int(11) DEFAULT '0',
  PRIMARY KEY (teid)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;
