create database database_ironiapp;

use database_ironiapp;

create table users(
    id int(10) not null,
    username varchar2(100) not null,
    password varchar2(100) not null
);

alter table users
    add primary key (id);

    alter table users 
        modify id int(11) not null auto_increment, auto_increment = 1;


create table topics(
    id int(10) not null,
    name varchar(100) not null,
    primary key (id)
);

alter table topics 
    modify id int(10) not null auto_increment, auto_increment = 1;

create table sentence(
    id int(10) not null,
    content varchar(100) not null,
    topic_id  int(10) not null,
    primary key (id),
    foreign key (topic_id) references topics(id)
);

alter table sentence 
    modify id int(10) not null auto_increment, auto_increment = 1;


create table answer(
    id int(10) not null,
    content varchar(100) not null,
    user_id  int(10) not null,
    primary key (id),
    foreign key (user_id) references users(id)
);

alter table answer 
    modify id int(10) not null auto_increment, auto_increment = 1;

insert into topics(name)
values ('Tiempo');

insert into topics(name)
values ('Colores');

insert into topics(name)
values ('Sitruaciones');


drop table topics ; 


 --ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';       

 --flush privileges;