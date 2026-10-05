const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, "data.json");

// Настройка шаблонизатора EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Функция чтения данных
function readItems() {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

// 1. Главная страница (список туров)
app.get("/", function (req, res) {
    res.render("index", {
        title: "Туры по Астане 2026",
        heading: "Доступные экскурсии",
        tours: readItems() // Передаём массив туров в шаблон
    });
});

// 2. Страница конкретного тура по ID
app.get("/tour/:id", function (req, res) {
    const id = Number(req.params.id);
    const tour = readItems().find(x => x.id === id);

    if (!tour) {
        return res.status(404).render("404", {
            title: "Не найдено",
            message: "Запрошенный тур не найден."
        });
    }

    res.render("tour", { 
        title: tour.title, 
        tour: tour 
    });
});

// 3. Информационная страница «О проекте»
app.get("/about", function (req, res) {
    res.render("about", { 
        title: "О нас — AstanaTours", 
        heading: "О нашем проекте" 
    });
});

// 4. API-маршрут (получение JSON списка туров)
app.get("/api/items", function (req, res) {
    res.json(readItems());
});

// 5. Обработка несуществующих маршрутов (404)
app.use(function (req, res) {
    res.status(404).render("404", {
        title: "Страница не найдена",
        message: "Упс! Такой страницы не существует."
    });
});

app.listen(PORT, () => console.log(`Сервер запущен: http://localhost:${PORT}`));