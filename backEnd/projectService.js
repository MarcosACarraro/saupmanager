var projectService = (function () {

    var _select = function (db, filtro, callback) {
        var queryString = "";
        if (filtro.cmd == "Count") {
            queryString = 'SELECT COUNT(*) AS Total FROM Project WHERE Description LIKE ?';
        } else {
            queryString = "SELECT * FROM Project WHERE Description LIKE ? limit " + filtro.skip + "," + filtro.take;
        }
        var list = db.query(queryString, '%' + filtro.Description + '%', function (err, rows, fields) {
            if (err) {
                console.log(err);
                throw err
            };
            callback(rows)
        });
    }

    var _save = function (db, project, callback) {
        if (project.CodProject === "0") {
            delete project.CodProject;
            var query = db.query('INSERT INTO Project SET ?', project, function (err, result) {
                if (err) {
                    console.log(err);
                    throw err
                };
                callback(result);
            });
        } else {
            var query = db.query('UPDATE  Project SET Description = ? , ETA= ?, Progress = ? WHERE CodProject = ?', [project.Description, project.ETA, project.Progress, project.CodProject], function (err, result) {
                if (err) {
                    console.log(err);
                    throw err
                };
                callback(result);
            });
        }
    }

    var _exclude = function (db, filtro, callback) {
        var query = db.query('DELETE FROM Project WHERE CodProject = ?', [filtro.id], function (err, result) {
            if (err) {
                console.log(err);
                throw err
            };
            callback();
        });
    }

    return {
        select: _select,
        save: _save,
        exclude: _exclude,
    }
})();

module.exports = projectService;

