# Oracle SQL 
## Table Creation
CREATE TABLE excercise.tree(
    id CHAR(36) NOT NULL,
    parent CHAR(36),
    label VARCHAR2(200) NOT NULL,
    PRIMARY KEY(id)
);

## Fetch Tree
SELECT * FROM tree;

## Insert Element
INSERT INTO tree (id, parent, label) VALUES (:id, :parent, :label)