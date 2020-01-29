const express = require("express");
const server = express();

server.use(express.json());

const projects = [];

//Middleware para ver se o projeto existe
function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id == id);

  if (!project) {
    return res.status(400).json({ error: "Project not found" });
  }

  return next();
}

/*
function numRequest(req, res, next) {
  console.count("Número de requisições");
  return next;
}
server.use(numRequest);
*/

//Middleware para ver numero de requisições
server.use((req, res, next) => {
  console.count("Número de requisições");

  return next();
});

//Rota para listagem dos meus projetos
server.get("/projects", (req, res) => {
  //console.log("entrou aq");
  return res.json(projects);
});

//Rota para criação de novos projetos
server.post("/projects", (req, res) => {
  //console.log("entrou aq");

  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return res.json(project);
});

//Rota para criação de nova tarefa via parametro
server.post("/projects/:id/tasks", checkProjectExists, (req, res) => {
  //console.log("entrou aq");

  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);
  project.tasks.push(title);

  return res.json(project);
});

//Rota para alterar title do projeto via parametro
server.put("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);
  project.title = title;

  return res.json(project);
});

//Rota para deletar um projeto via parametro
server.delete("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const projectIndex = projects.findIndex(p => p.id == id);
  projects.splice(projectIndex, 1);

  return res.send();
});

server.listen(3000);
