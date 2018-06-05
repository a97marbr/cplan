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

/* Code to update sequences after a restore */
SELECT setval(pg_get_serial_sequence('teacher', 'tid'), coalesce(max(tid),0) + 1, false) FROM teacher;
SELECT setval(pg_get_serial_sequence('teaching', 'teid'), coalesce(max(teid),0) + 1, false) FROM teaching;
SELECT setval(pg_get_serial_sequence('course', 'cid'), coalesce(max(cid),0) + 1, false) FROM course;
SELECT setval(pg_get_serial_sequence('course_instance', 'ciid'), coalesce(max(ciid),0) + 1, false) FROM course_instance;
