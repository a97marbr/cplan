CREATE TABLE course (
  cid SERIAL NOT NULL,
  cname VARCHAR(100) DEFAULT NULL,
  ccode VARCHAR(45) DEFAULT NULL,
  credits DECIMAL(3,1) DEFAULT NULL,
  class VARCHAR(45) DEFAULT NULL,
  program_year INT DEFAULT NULL,
  PRIMARY KEY (cid)
);

CREATE TABLE course_instance (
  ciid SERIAL NOT NULL,
  cid INT NOT NULL,
  coordinator INT NOT NULL,
  examiner INT NOT NULL,
  start_period INT DEFAULT NULL,
  end_period INT DEFAULT NULL,
  year varchar(4) DEFAULT NULL,
  students INT DEFAULT NULL,
  study_program varchar(100) DEFAULT NULL,
  planner INT DEFAULT NULL,
  comment varchar(1024) DEFAULT NULL,
  create_ts timestamp DEFAULT NULL,
  changed_ts timestamp DEFAULT NULL,
  alt_ts timestamp DEFAULT NULL,
  lecture_time INT DEFAULT 0,
  supervise_time INT DEFAULT 0,
  student_time INT DEFAULT 0,
  time_budget JSONB,
  PRIMARY KEY (ciid)
);

CREATE TABLE teacher (
  tid SERIAL NOT NULL,
  fname VARCHAR(100) DEFAULT NULL,
  lname VARCHAR(100) DEFAULT NULL,
  sign VARCHAR(5) DEFAULT NULL,
  PRIMARY KEY (tid)
);

CREATE TABLE teaching (
  teid SERIAL NOT NULL,
  teacher INT DEFAULT NULL,
  ciid INT DEFAULT NULL,
  hours INT DEFAULT NULL,
  status INT DEFAULT 0,
  create_ts TIMESTAMP DEFAULT NULL,
  changed_ts TIMESTAMP DEFAULT NULL,
  alt_ts TIMESTAMP DEFAULT NULL,
  PRIMARY KEY (teid)
);

CREATE TABLE worktype(
    id INTEGER NOT NULL,
    letter CHAR(1),
    short_desc CHAR(12),
    long_desc VARCHAR(512),
    PRIMARY KEY (id)
);

CREATE TABLE year_period(
    id INTEGER NOT NULL,
    short_desc CHAR(3),
    long_desc VARCHAR(32),
    PRIMARY KEY (id)
);

CREATE TABLE teacher_year_budget (
    year INTEGER NOT NULL,
    tid INTEGER NOT NULL,
    yperiod INTEGER NOT NULL,
    wtype INTEGER NOT NULL,
    whours REAL,
    comment VARCHAR(512),
    create_ts TIMESTAMP DEFAULT NULL,
    changed_ts TIMESTAMP DEFAULT NULL,
    alt_ts TIMESTAMP DEFAULT NULL,
    PRIMARY KEY(year,tid,yperiod,wtype),
    FOREIGN KEY(tid) REFERENCES teacher(tid),
    FOREIGN KEY(wtype) REFERENCES worktype(id)
);

INSERT INTO worktype(id,letter,short_desc,long_desc) VALUES(1,'T','Teaching','');
INSERT INTO worktype(id,letter,short_desc,long_desc) VALUES(2,'R','Research','');
INSERT INTO worktype(id,letter,short_desc,long_desc) VALUES(3,'D','P Dev','Personal Development');
INSERT INTO worktype(id,letter,short_desc,long_desc) VALUES(4,'P','SP Coord','Studyprogram Coordinator');

INSERT INTO year_period(id,short_desc,long_desc) VALUES(1,'lp1','Läsperiod 1');
INSERT INTO year_period(id,short_desc,long_desc) VALUES(2,'lp2','Läsperiod 2');
INSERT INTO year_period(id,short_desc,long_desc) VALUES(3,'lp3','Läsperiod 3');
INSERT INTO year_period(id,short_desc,long_desc) VALUES(4,'lp4','Läsperiod 4');
INSERT INTO year_period(id,short_desc,long_desc) VALUES(5,'lp5','Läsperiod 5');

/* Code to update sequences after a restore */
SELECT setval(pg_get_serial_sequence('teacher', 'tid'), coalesce(max(tid),0) + 1, false) FROM teacher;
SELECT setval(pg_get_serial_sequence('teaching', 'teid'), coalesce(max(teid),0) + 1, false) FROM teaching;
SELECT setval(pg_get_serial_sequence('course', 'cid'), coalesce(max(cid),0) + 1, false) FROM course;
SELECT setval(pg_get_serial_sequence('course_instance', 'ciid'), coalesce(max(ciid),0) + 1, false) FROM course_instance;
