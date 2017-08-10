CREATE TABLE Project (
  CodProject INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  Description varchar(20) NULL,
  ETA INT(6) UNSIGNED NULL,
  Progress INT(6) UNSIGNED NULL
); 

insert into Project(Description,ETA,Progress) values("Project 1",0,0);
insert into Project(Description,ETA,Progress) values("Project 2",0,0);


select * from Project