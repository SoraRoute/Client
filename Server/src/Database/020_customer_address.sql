create table customer_addresses(
    id int auto_increment primary key,
    customer_id int not null,
    address_line1 varchar(255) not null,
    address_line2 varchar(255),
    city varchar(100) not null,
    state varchar(100) not null,
    pincode varchar(10) not null,
    country varchar(100) default 'India',
    address_type ENUM('home', 'work', 'other') default 'home',
    is_default boolean default false,
    created_at timestamp default current_timestamp,
    foreign key (customer_id)
    references users(id)
    on delete cascade
);