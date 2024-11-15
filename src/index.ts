import express from 'express';
import pool from './Utils/Pool';
import { Post } from './Entity/Post';
import { User } from './Entity/User';

const app = express();
app.use(express.json());

// Debugging: Mostrar variáveis de ambiente
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_NAME:', process.env.DB_NAME);

// Endpoint para obter todos os usuários
app.get('/users', async (req, res) => {
    try {
        // Usando aspas duplas corretamente para a tabela "user"
        const result = await pool.query('SELECT * FROM public."user"');
        
        const users: User[] = result.rows.map(row => 
            new User(row.id, row.firstname, row.lastname, row.email) // Garantindo que o nome das colunas corresponda com a tabela
        );
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Database error', details: error });
    }
});

// Endpoint para adicionar um usuário
app.post('/users', async (req, res) => {
    try {
        const { id, firstname, lastname, email } = req.body;

        // Criando um novo usuário
        const newUser = new User(id, firstname, lastname, email);
        
        // Inserindo no banco de dados usando um comando SQL parametrizado
        const result = await pool.query(
            'INSERT INTO public."user"("id", "firstname", "lastname", "email") VALUES ($1, $2, $3, $4) RETURNING *',
            [newUser.id, newUser.firstname, newUser.lastname, newUser.email]
        );
        
        const createdUser = new User(
            result.rows[0].id,
            result.rows[0].firstname,
            result.rows[0].lastname,
            result.rows[0].email
        );
        
        // Retornando o usuário recém-criado
        res.status(201).json(createdUser);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Database error', details: error });
    }
});

// Endpoint para obter todos os posts
app.get('/posts', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM public."post"');
        
        const posts: Post[] = result.rows.map(row =>
            new Post(row.id, row.title, row.description, row.userId)
        );
        res.json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Database error', details: error });
    }
});

// Endpoint para adicionar um post
app.post('/posts', async (req, res) => {
    try {
        const { id, title, description, userId } = req.body;

        const newPost = new Post(id, title, description, userId);
        
        const result = await pool.query(
            'INSERT INTO public."post"("id", "title", "description", "userId") VALUES ($1, $2, $3, $4) RETURNING *',
            [newPost.id, newPost.title, newPost.description, newPost.userId]
        );
        
        const createdPost = new Post(
            result.rows[0].id,
            result.rows[0].title,
            result.rows[0].description,
            result.rows[0].userId
        );
        
        res.status(201).json(createdPost);
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ error: 'Database error', details: error });
    }
});

// Iniciar o servidor
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
