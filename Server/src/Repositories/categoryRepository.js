class CategoryRepository{

    async addCategory(connection,categoryData){
        const query = `Insert into categories (
            name,
            description,
            parent_category_id,
            status
        ) values (?,?,?,?)`;

        const values = [
            categoryData.name,
            categoryData.description,
            categoryData.parent_category_id,
            categoryData.status || "ACTIVE"
        ]

        const [result] = await connection.query(query,values);

        return result.insertId;

    }

    async getAllCategoriesForCustomer(connection){
        const query = `Select 
            id,
            name,
            description,
            parent_category_id,
            status
        from categories 
        where status = 'ACTIVE'
        ORDER BY name ASC
        `;

        const [result] = await connection.query(query);

        return result;
    }

    async getAllCategoriesForAdmin(connection){
        const query = `Select 
            id,
            name,
            description,
            parent_category_id,
            status
        from categories ORDER BY name ASC`;

        const [result] = await connection.query(query);

        return result;
    }

    async getCategoryById(connection,categoryId){
        const query = `Select 
            id,
            name,
            description,
            parent_category_id,
            status
        from categories where id = ?`;

        const [result] = await connection.query(query,[categoryId]);

        return result[0];
    }

    async findCategoryByName(connection,categoryName){

        const query = `Select * from categories where name = ?`;

        const [rows] = await connection.query(query,[categoryName]);

        return rows[0];
    }

    async findCategoryByNameExceptId(connection, categoryName, categoryId){

        const query = `
            SELECT * 
            FROM categories 
            WHERE name = ?
            AND id != ?
        `;

        const [rows] = await connection.query(query,[
            categoryName,
            categoryId
        ]);

        return rows[0];
    }

    async updateCategory(connection,categoryData){
        const query = `
        Update categories Set 
            name = ?,
            description = ?,
            parent_category_id = ?,
            status = ?
        where id = ?`;

        const values = [
            categoryData.name,
            categoryData.description,
            categoryData.parent_category_id,
            categoryData.status || 'ACTIVE',
            categoryData.id
        ]

        const [result] = await connection.query(query,values);

        return result.affectedRows;
    }

    async deleteCategory(connection,categoryId){
        const query = `Delete from categories where id = ?`;

        const [result] = await connection.query(query,[categoryId]);

        return result.affectedRows;
    }

    async changeStatus(connection,categoryId,status){
        const query = `Update categories Set status = ? where id = ?`;

        const [result] = await connection.query(query,[status,categoryId]);

        return result.affectedRows;

    }

}

module.exports = new CategoryRepository();
