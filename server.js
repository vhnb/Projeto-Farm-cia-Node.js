const express = require('express')
const { MongoClient, ObjectId } = require('mongodb')
const app = express()
const port = 3000
const path = require('path')
const methodOverride = require('method-override')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

const public = path.join(__dirname, 'public')
app.use(express.static(public))

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

const url = 'mongodb://localhost:27017/'
const dbName = 'hospital'
const collectionMedicamentos = 'medicamentos'
const collectionClientes = 'clientes'
const collectionVendas = 'vendas'

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/pages/index.html')
})

app.get('/medicamentos', (req, res) => {
    res.sendFile(__dirname + '/pages/medicamentos.html')
})

app.get('/buscarmedicamentos', async (req, res) => {
    const { nome_medicamento } = req.query
    const client = new MongoClient(url)

    try {
        await client.connect()
        const db = client.db(dbName)
        const collection = db.collection(collectionMedicamentos)

        const medicamentos = await collection.find({ nome_medicamento: new RegExp(nome_medicamento, 'i') }).toArray()

        res.render('resultadobuscamed', { medicamentos })
    } catch (error) {
        console.error('Erro ao buscar medicamentos:', error)
        res.status(500).send('Erro ao buscar medicamentos. Por favor, tente novamente mais tarde.')
    } finally {
        client.close()
    }
})

app.get('/atualizarmedicamentos', (req, res) => {
    res.sendFile(__dirname + '/pages/atualizar/atualizarmedicamentos.html')
})

app.get('/mostrarmedicamentos', async (req, res) => {
    const client = new MongoClient(url)

    try {
        await client.connect()
        const db = client.db(dbName)
        const collection = db.collection(collectionMedicamentos)

        const medicamentos = await collection.find({}, { projection: { _id: 1, nome_medicamento: 1, registro_medicamento: 1, dosagem_medicamento: 1 } }).toArray()
        res.json(medicamentos)

    } catch (error) {
        console.error('Erro ao buscar medicamentos:', error)
        res.status(500).send('Erro ao buscar medicamentos. Por favor, tente novamente mais tarde.')
    } finally {
        client.close()
    }
})

app.post('/medicamentos', async (req, res) => {
    const novoMedicamento = req.body
    const client = new MongoClient(url)

    try {
        await client.connect()
        const db = client.db(dbName)
        const collection = db.collection(collectionMedicamentos)

        const result = await collection.insertOne(novoMedicamento)
        console.log(`Medicamento cadastrado com sucesso. ID: ${result.insertedId}`)

        res.redirect('/medicamentos')
    } catch (error) {
        console.error('Erro ao cadastrar medicamento:', error)
        res.status(500).send('Erro ao cadastrar medicamento. Por favor, tente novamente mais tarde.')
    } finally {
        client.close()
    }
})

app.post('/deletarmedicamentos', async (req, res) => {
    const { id } = req.body

    const client = new MongoClient(url)

    try {
        await client.connect()

        const db = client.db(dbName)
        const collection = db.collection(collectionMedicamentos)

        const result = await collection.deleteOne({ _id: new ObjectId(id) })

        if (result.deletedCount > 0) {
            console.log(`Medicamento com ID: ${id} deletado com sucesso.`)
            res.redirect('/medicamentos')
        } else {
            res.status(404).send('Medicamento não encontrado.')
        }
    } catch (error) {
        console.error('Erro ao deletar medicamento:', error)
        res.status(500).send('Erro ao deletar medicamento. Por favor, tente novamente mais tarde.')
    } finally {
        client.close()
    }
})

app.post('/atualizarmedicamentos', async (req, res) => {
    const { id, nome_medicamento, registro_medicamento, dosagem_medicamento } = req.body

    const client = new MongoClient(url)

    try {
        await client.connect()

        const db = client.db(dbName)
        const collection = db.collection(collectionMedicamentos)

        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            {
                $set: { nome_medicamento, registro_medicamento, dosagem_medicamento }
            }
        )

        if (result.modifiedCount > 0) {
            console.log(`Medicamento com ID: ${id} atualizado com sucesso`)
            res.redirect('/medicamentos')
        } else {
            res.status(404).send("Medicamento não encontrado.")
        }
    } catch (error) {
        console.error('Erro ao atualizar medicamento:', error)
        res.status(500).send('Erro ao atualizar medicamento. Por favor, tente novamente mais tarde.')
    } finally {
        client.close()
    }
})

app.get('/medicamento/:id', async (req, res) => {
    const { id } = req.params

    const client = new MongoClient(url)

    try {
        await client.connect()
        
        const db = client.db(dbName)
        const collection = db.collection(collectionMedicamentos)

        const medicamento = await collection.findOne({ _id: new ObjectId(id) })

        if(!medicamento) {
            return res.status(404).send('Medicamento não encontrado')
        }

        res.json(medicamento)
    } catch (error) {
        console.error('Erro ao buscar o medicamento:', error)
        res.status(500).send('Erro ao buscar o medicamento. Por favor, tente novamente mais tarde.')
    } finally {
        client.close()
    }
})

app.get('/clientes', (req, res) => {
    res.sendFile(__dirname + '/pages/clientes.html')
})

app.get('/atualizarclientes', (req, res) => {
    res.sendFile(__dirname + '/pages/atualizar/atualizarclientes.html')
})

app.get('/mostrarclientes', async (req, res) => {
    const client = new MongoClient(url)

    try {
        await client.connect()
        const db = client.db(dbName)
        const collection = db.collection(collectionClientes)

        const clientes = await collection.find({}, { projection: { _id: 1, nome_cliente: 1, data_cliente: 1, documento_cliente: 1 } }).toArray()
        res.json(clientes)

    } catch (error) {
        console.error('Erro ao buscar clientes:', error)
        res.status(500).send('Erro ao buscar clientes. Por favor, tente novamente mais tarde.')
    } finally {
        client.close()
    }
})

app.post('/clientes', async (req, res) => {
    const novoCliente = req.body
    const client = new MongoClient(url)

    try {
        await client.connect()
        const db = client.db(dbName)
        const collection = db.collection(collectionClientes)

        const result = await collection.insertOne(novoCliente)
        console.log(`Cliente cadastrado com sucesso. ID: ${result.insertedId}`)

        res.redirect('/clientes')
    } catch (error) {
        console.error('Erro ao cadastrar cliente:', error)
        res.status(500).send('Erro ao cadastrar cliente. Por favor, tente novamente mais tarde.')
    } finally {
        client.close()
    }
})

app.post('/deletarclientes', async (req, res) => {
    const { id } = req.body

    const client = new MongoClient(url)

    try {
        await client.connect()

        const db = client.db(dbName)
        const collection = db.collection(collectionClientes)

        const result = await collection.deleteOne({ _id: new ObjectId(id) })

        if (result.deletedCount > 0) {
            console.log(`Cliente com ID: ${id} deletado com sucesso.`)
            res.redirect('/clientes')
        } else {
            res.status(404).send('Cliente não encontrado.')
        }
    } catch (error) {
        console.error('Erro ao deletar cliente:', error)
        res.status(500).send('Erro ao deletar cliente. Por favor, tente novamente mais tarde.')
    } finally {
        client.close()
    }
})

app.post('/atualizarclientes', async (req, res) => {
    const { id, nome_cliente, data_cliente, documento_cliente } = req.body

    const client = new MongoClient(url)

    try {
        await client.connect()

        const db = client.db(dbName)
        const collection = db.collection(collectionClientes)

        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            {
                $set: { nome_cliente, data_cliente, documento_cliente }
            }
        )

        if (result.modifiedCount > 0) {
            console.log(`Cliente com ID: ${id} atualizado com sucesso`)
            res.redirect('/clientes')
        } else {
            res.status(404).send("Cliente não encontrado.")
        }
    } catch (error) {
        console.error('Erro ao atualizar cliente:', error)
        res.status(500).send('Erro ao atualizar cliente. Por favor, tente novamente mais tarde.')
    } finally {
        client.close()
    }
})

app.get('/cliente/:id', async (req, res) => {
    const { id } = req.params

    const client = new MongoClient(url)

    try {
        await client.connect()
        
        const db = client.db(dbName)
        const collection = db.collection(collectionClientes)

        const cliente = await collection.findOne({ _id: new ObjectId(id) })

        if(!cliente) {
            return res.status(404).send('Cliente não encontrado')
        }

        res.json(cliente)
    } catch (error) {
        console.error('Erro ao buscar o cliente:', error)
        res.status(500).send('Erro ao buscar o cliente. Por favor, tente novamente mais tarde.')
    } finally {
        client.close()
    }
})

app.get('/vendas', (req, res) => {
    res.sendFile(__dirname + '/pages/vendas.html')
})

app.get('/atualizarvendas', (req, res) => {
    res.sendFile(__dirname + '/pages/atualizar/atualizarvendas.html')
})

app.get('/mostrarvendas', async (req, res) => {
    const client = new MongoClient(url)

    try {
        await client.connect()
        const db = client.db(dbName)
        const collection = db.collection(collectionVendas)

        const vendas = await collection.find({}, { projection: { _id: 1, info_vendas_cliente: 1, info_vendas_medicamento: 1, quantidade: 1, data_venda: 1 } }).toArray()
        res.json(vendas)

    } catch (error) {
        console.error('Erro ao buscar vendas:', error)
        res.status(500).send('Erro ao buscar vendas. Por favor, tente novamente mais tarde.')
    } finally {
        client.close()
    }
})

app.post('/vendas', async (req, res) => {
    const novaVenda = req.body
    const client = new MongoClient(url)

    try {
        await client.connect()
        const db = client.db(dbName)

        const collection = db.collection(collectionVendas)
        const result = await collection.insertOne(novaVenda)

        console.log(`Venda cadastrada com sucesso. ID: ${result.insertedId}`)

        res.redirect('/vendas')
    } catch (error) {
        console.error('Erro ao cadastrar venda:', error)
        res.status(500).send('Erro ao cadastrar venda. Por favor, tente novamente mais tarde.')
    } finally {
        client.close()
    }
})

app.post('/deletarvendas', async (req, res) => {
    const { id } = req.body

    const client = new MongoClient(url)

    try {
        await client.connect()

        const db = client.db(dbName)
        const collection = db.collection(collectionVendas)

        const result = await collection.deleteOne({ _id: new ObjectId(id) })

        if (result.deletedCount > 0) {
            console.log(`Venda com ID: ${id} deletada com sucesso.`)
            res.redirect('/vendas')
        } else {
            res.status(404).send('Venda não encontrada.')
        }
    } catch (error) {
        console.error('Erro ao deletar venda:', error)
        res.status(500).send('Erro ao deletar venda. Por favor, tente novamente mais tarde.')
    } finally {
        client.close()
    }
})

app.post('/atualizarvendas', async (req, res) => {
    const { id, info_vendas_cliente, info_vendas_medicamento, quantidade, data_venda } = req.body

    const client = new MongoClient(url)

    try {
        await client.connect()

        const db = client.db(dbName)
        const collection = db.collection(collectionVendas)

        

        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            {
                $set: { info_vendas_cliente, info_vendas_medicamento, quantidade, data_venda }
            }
        )

        if (result.modifiedCount > 0) {
            console.log(`Venda com ID: ${id} atualizada com sucesso`)
            res.redirect('/vendas')
        } else {
            res.status(404).send("Venda não encontrada.")
        }
    } catch (error) {
        console.error('Erro ao atualizar venda:', error)
        res.status(500).send('Erro ao atualizar venda. Por favor, tente novamente mais tarde.')
    } finally {
        client.close()
    }
})

app.get('/venda/:id', async (req, res) => {
    const { id } = req.params

    const client = new MongoClient(url)

    try {
        await client.connect()
        
        const db = client.db(dbName)
        const collection = db.collection(collectionVendas)

        const venda = await collection.findOne({ _id: new ObjectId(id) })

        if(!venda) {
            return res.status(404).send('Venda não encontrada')
        }

        res.json(venda)
    } catch (error) {
        console.error('Erro ao buscar a venda:', error)
        res.status(500).send('Erro ao buscar a venda. Por favor, tente novamente mais tarde.')
    } finally {
        client.close()
    }
})

app.listen(port, () => {
    console.log(`http://localhost:${port}`)
})
