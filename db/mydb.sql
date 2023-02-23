create table Registrations (
  id integer primary key,
  first_name varchar(30),
  last_name varchar(30),
  grade integer,
  email varchar(50),
  shirt_size ENUM('S', 'M', 'L'),
  username varchar(30)
);


