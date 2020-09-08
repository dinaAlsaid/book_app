DROP TABLE IF EXISTS books;

CREATE TABLE IF NOT EXISTS books(
    id SERIAL PRIMARY KEY,
    author VARCHAR(255),
    title VARCHAR(255),
    isbn VARCHAR(255) ,
    image_url VARCHAR(255),
    description VARCHAR(1024),
    categories VARCHAR(255)
);

INSERT INTO books (author,title,isbn,image_url,description,categories) VALUES ('Dina','EJS & SQL 101','ISBN_13 9780441113593','https://purepng.com/public/uploads/large/purepng.com-thinking-womanthinking-womanwomengirlfemalethinkingbusiness-women-thinkinggirl-sitting-thinking-1421526925988xnkmh.png','LORES IPSUM DESCRIPTION','informational');
INSERT INTO books (author,title,isbn,image_url,description,categories) VALUES ('Hamza','JS 101','ISBN_13 9790441113593','https://www.vhv.rs/dpng/d/155-1558328_man-thinking-png-man-images-free-download-transparent.png','LORES IPSUM DESCRIPTION','informational');
INSERT INTO books (author,title,isbn,image_url,description,categories) VALUES ('Ahmad','debugging 101','ISBN_13 9790541113593','https://www.vhv.rs/dpng/d/155-1558328_man-thinking-png-man-images-free-download-transparent.png','LORES IPSUM DESCRIPTION','informational');