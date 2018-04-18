drop database demo_tsnode_01;
create database demo_tsnode_01;
use demo_tsnode_01;

create table users(
    id int auto_increment primary key,
    email text not null,
    password text not null,
    createdAt datetime,
    updatedAt datetime
);
