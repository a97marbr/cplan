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


DELIMITER ///

CREATE TRIGGER course_instance_trigger BEFORE UPDATE ON course_instance
FOR EACH ROW BEGIN
	INSERT INTO audit(old_data, new_data, tbl_name,ts) 
	VALUES (CONCAT_WS(',',
    'ciid:',COALESCE(OLD.ciid,'NULL'),
    'cid:',COALESCE(OLD.cid,'NULL'),
    'coordinator:',COALESCE(OLD.coordinator,'NULL'),
    'examiner:',COALESCE(OLD.examiner,'NULL'),
    'start_period:',COALESCE(OLD.start_period,'NULL'), 
    'end_period:',COALESCE(OLD.end_period,'NULL'),
    'year:',COALESCE(OLD.year,'NULL'),
    'students:',COALESCE(OLD.students,'NULL'),
    'study_program:',COALESCE(OLD.study_program,'NULL'),
    'planner:',COALESCE(OLD.planner,'NULL'),
    'comment:',COALESCE(OLD.comment,'NULL'),
    'create_ts:',COALESCE(OLD.create_ts,'NULL'),
    'changed_ts:',COALESCE(OLD.changed_ts,'NULL'),
    'alt_ts:',COALESCE(OLD.alt_ts,'NULL')),
    CONCAT_WS(',',
    'ciid:',COALESCE(NEW.ciid,'NULL'),
    'cid:',COALESCE(NEW.cid,'NULL'),
    'coordinator:',COALESCE(NEW.coordinator,'NULL'),
    'examiner:',COALESCE(NEW.examiner,'NULL'),
    'start_period:',COALESCE(NEW.start_period,'NULL'),
    'end_period:',COALESCE(NEW.end_period,'NULL'),
    'year:',COALESCE(NEW.year,'NULL'),
    'students:',COALESCE(NEW.students,'NULL'),
    'study_program:',COALESCE(NEW.study_program,'NULL'),
    'planner:',COALESCE(NEW.planner,'NULL'),
    'comment:',COALESCE(NEW.comment,'NULL'),
    'create_ts:',COALESCE(NEW.create_ts,'NULL'),
    'changed_ts:',COALESCE(NEW.changed_ts,'NULL'),
    'alt_ts:',COALESCE(NEW.alt_ts,'NULL')), 
    "course_instance", 
    NOW());
END;

///
DELIMITER ;

DELIMITER ///

CREATE TRIGGER teaching_trigger BEFORE UPDATE ON teaching
FOR EACH ROW BEGIN
	INSERT INTO audit(old_data, new_data, tbl_name,ts) 
	VALUES (CONCAT_WS(',',
    'teid:',COALESCE(OLD.teid,'NULL'),
    'teacher:',COALESCE(OLD.teacher,'NULL'),
    'ciid:',COALESCE(OLD.ciid,'NULL'),
    'hours:',COALESCE(OLD.hours,'NULL'),
    'status:',COALESCE(OLD.status,'NULL'), 
    'create_ts:',COALESCE(OLD.create_ts,'NULL'),
    'changed_ts:',COALESCE(OLD.changed_ts,'NULL'),
    'alt_ts:',COALESCE(OLD.alt_ts,'NULL')),
    CONCAT_WS(',',
    'teid:',COALESCE(NEW.teid,'NULL'),
    'teacher:',COALESCE(NEW.teacher,'NULL'),
    'ciid:',COALESCE(NEW.ciid,'NULL'),
    'hours:',COALESCE(NEW.hours,'NULL'),
    'status:',COALESCE(NEW.status,'NULL'), 
    'create_ts:',COALESCE(NEW.create_ts,'NULL'),
    'changed_ts:',COALESCE(NEW.changed_ts,'NULL'),
    'alt_ts:',COALESCE(NEW.alt_ts,'NULL')),
    "teaching", 
    NOW());
END;

///
DELIMITER ;
