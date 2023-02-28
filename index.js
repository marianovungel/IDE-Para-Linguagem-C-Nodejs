const express = require('express')
const { generateFile } = require('./generateFile')
const { executeCpp } = require('./executeCpp')
const cors = require('cors')

const app = express()

//midle
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cors())

//rotas
app.get("/", (req, res)=>{
    return res.json("servidor do Compilador C++")
})

app.post("/run", async(req, res)=>{
    const {language = "cpp", code } = req.body;
    if(code === undefined){
        return res.status(400).json({success: false, error: "Corpo do código Vazio!"})
    }

    try {
        //é necessário gerar um arquivo c++ com o conteudo que vem do na requisição.
                //para gerar o arquivo c++, criaremos o arquivo generateFile.js
        const filepath = await generateFile(language, code)
        //precisamos executar o arquivo e enviar a resposta a para a requisiçãao feita.
        const output = await executeCpp(filepath)

        return res.json({filepath, output})
    } catch (error) {
        res.status(400).json(error)
    }
    
})

app.listen("5000", console.log("funcionando na porta 5000"))