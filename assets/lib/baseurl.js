// "Базовый адрес" приложения

var fs = require('fs');

var baseUrlPath = "baseurl.json";

module.exports = function () {
	// Чтение из файла с обработкой исключений
	try {
        var data;

        if (fs.existsSync(baseUrlPath)) {
            var text = fs.readFileSync(baseUrlPath, {encoding: 'utf-8'});
            data = JSON.parse(text);
            if (!data.hasOwnProperty('baseurl')) {
                //noinspection ExceptionCaughtLocallyJS
                throw new Error("Неверный формат файла baseurl.json");
            }
        } else {
            data = { baseurl : "" };
            fs.writeFileSync(baseUrlPath, JSON.stringify(data));
        }

		var url = data.baseurl;
	} catch (err) {
		console.error("Ошибка чтения базового адреса: ", err);
		process.exit(1);
	}

	// Если адрес = '/', преобразуем в '' для правильной работы маршрутов
	if (url == '/') {
		url = '';
	}

	return url;
};
