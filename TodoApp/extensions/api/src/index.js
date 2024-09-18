export default (router, context) => {

	const { services, getSchema, database } = context;

	router.get('/test', (req, res) => res.send('Hello, World!'));

	router.get('/get-todo', async (req, res) => {

		const response = await database.from('todo').select('*').orderBy('date_created', 'desc');

		res.send(response)
	})

	router.post('/add-todo', async (req, res) => {
		const todo = req.body.todo_text;
		const status = req.body.status;
		const dateCreated = new Date().toISOString();
		
		try {
			const response = await database.from('todo').insert({
				todo_text: todo,
				status: status,
				date_created: dateCreated
			});
			res.send(response);
		} catch (error) {
			console.error('Error adding todo:', error);
			res.status(500).send('There was an error adding the todo.');
		}
	});

	router.patch('/edit-todo', async (req, res) => {
		const id = req.body.id;
		const todo = req.body.todo_text;
		const status = req.body.status;
		const dateUpdate = new Date().toISOString();
	
		try {
			const response = await database.from('todo').where({ id: id }).update({
				todo_text: todo,
				status: status,
				date_updated: dateUpdate
			});
		
			if (response) {
				res.json({ success: true, message: 'Todo updated successfully', rowsAffected: response });
			} else {
				throw new Error('Update failed');
			}
		} catch (error) {
			console.error('Error updating todo:', error);
			res.status(500).send('There was an error updating the todo.');
		}
	});

	router.patch('/delete-todo', async (req, res) => {
		const id = req.body.id;
	
		try {
			const response = await database.from('todo').where({ id: id }).delete();
		
			if (response) {
				res.json({ success: true, message: 'Todo deleted successfully', rowsAffected: response });
			} else {
				throw new Error('Update failed');
			}
		} catch (error) {
			console.error('Error updating todo:', error);
			res.status(500).send('There was an error deleting the todo.');
		}
	});
	
	
	
};
