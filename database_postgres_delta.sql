ALTER TABLE teacher ADD COLUMN pwd VARCHAR(128);
ALTER TABLE teacher ADD COLUMN access INTEGER DEFAULT 0;
ALTER TABLE teacher ADD COLUMN active INTEGER DEFAULT 1;

CREATE TABLE cstatus
(
    id INT,
    letter CHAR(1) UNIQUE,
    short_desc CHAR(12),
    long_desc VARCHAR(64),
    PRIMARY KEY(id)
);

INSERT INTO cstatus
    (id,letter,short_desc,long_desc)
VALUES
    (0, 'U', 'Unconfirmed', 'Unconfirmed');
INSERT INTO cstatus
    (id,letter,short_desc,long_desc)
VALUES
    (1, 'C', 'Confirmed', 'Confirmed');
INSERT INTO cstatus
    (id,letter,short_desc,long_desc)
VALUES
    (2, 'M', 'Must change', 'Must change');
INSERT INTO cstatus
    (id,letter,short_desc,long_desc)
VALUES
    (3, 'E', 'Error', 'Error');

ALTER TABLE teaching ADD FOREIGN KEY (teacher) REFERENCES teacher(tid);
ALTER TABLE teaching ADD FOREIGN KEY (ciid) REFERENCES course_instance(ciid);
ALTER TABLE teaching ADD FOREIGN KEY (status) REFERENCES cstatus(id);

ALTER TABLE course_instance ADD FOREIGN KEY (cid) REFERENCES course(cid);
ALTER TABLE course_instance ADD FOREIGN KEY (planner) REFERENCES teacher(tid);

ALTER TABLE course ADD COLUMN active INT DEFAULT 1;
ALTER TABLE course ADD UNIQUE (ccode);

ALTER TABLE course_instance ADD COLUMN create_usr INT DEFAULT NULL;
ALTER TABLE course_instance ADD COLUMN change_usr INT DEFAULT NULL;
ALTER TABLE course_instance ADD COLUMN alt_usr INT DEFAULT NULL;
ALTER TABLE course_instance ADD FOREIGN KEY (create_usr) REFERENCES teacher(tid);
ALTER TABLE course_instance ADD FOREIGN KEY (change_usr) REFERENCES teacher(tid);
ALTER TABLE course_instance ADD FOREIGN KEY (alt_usr) REFERENCES teacher(tid);

GRANT ALL PRIVILEGES ON TABLE course_instance_examiner TO cplanadmin;