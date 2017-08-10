var ctrPrint = (function () {
    var _printTable = {};
    var _datasource = [];
    var _projeto = {};
    var _txtEstimativa = {};
    var _progresso = 0;
 

    var _create = function (projeto) {
        _projeto = projeto;
        _datasource = _projeto.tarefas;
        createTablePrint();
        _printTableDataBind.call(this);

        var _lblProjeto = window.document.getElementById("lblProjetoPrint");
        _lblProjeto.innerHTML = "Projeto:&nbsp;" + _projeto.Descricao;
    }

    function createTablePrint() {
        /*table vai na div principal*/

        var _divPrintTable = window.document.getElementById("divPrintTable");

        _printTable = window.document.getElementById("PrintTarefaTable");
        if (_printTable) _printTable.remove();

        _printTable = window.document.createElement("table");
        _printTable.setAttribute("id", "PrintTarefaTable");
        _printTable.setAttribute("width", "100%");

        var row = _printTable.insertRow(0);
        var cell0 = row.insertCell(0);
        var cell1 = row.insertCell(1);
        var cell2 = row.insertCell(2);
        var cell3 = row.insertCell(3);
        cell3.setAttribute("align", "center");

        cell0.innerHTML = "Tarefa";
        cell1.innerHTML = "Progresso";
        cell2.innerHTML = "Horas";
        cell3.innerHTML = "Etapas"; 
     
        _divPrintTable.appendChild(_printTable);

    }


    var _printTableDataBind = function () {
        _limpar.call(this);
        var linha = 0;
        for (var i = 0; i < _datasource.length; i++) {
            linha++;

           
            //_datasource[i].KMS;
            
            var _divEtapas = window.document.createElement("div");

            if (_datasource[i].KMS) {
                var KMS = document.createElement('a');
                KMS.setAttribute('href', '#');
                KMS.setAttribute("class", "btn btn-warning btn-xs");
                var lblKMS = document.createElement('i');
                lblKMS.setAttribute("class", "fa fa-database");
                //lblKMS.innerHTML = "&nbsp;K";
                KMS.appendChild(lblKMS);
                _divEtapas.appendChild(KMS);
            }

            if (_datasource[i].PRISM) {
                var PRISM = document.createElement('a');
                PRISM.setAttribute('href', '#');
                PRISM.setAttribute("class", "btn btn-info btn-xs");
                var lblPRISM = document.createElement('i');
                lblPRISM.setAttribute("class", "fa fa-cloud-upload");
                //lblPRISM.innerHTML = "&nbsp;P";
                PRISM.appendChild(lblPRISM);
                _divEtapas.appendChild(PRISM);
            }

            if (_datasource[i].APPROVED) {
                var APPROVED = document.createElement('a');
                APPROVED.setAttribute('href', '#');
                APPROVED.setAttribute("class", "btn btn-success btn-xs");
                var lblAPPROVED = document.createElement('i');
                lblAPPROVED.setAttribute("class", "fa fa-check-square-o");
                //lblAPPROVED.innerHTML = "&nbsp;A";
                APPROVED.appendChild(lblAPPROVED);
                _divEtapas.appendChild(APPROVED);
            }


            var _divBar = window.document.createElement("div");
            _divBar.setAttribute("class", "progress-bar bg-blue");
            _divBar.setAttribute("role", "progressbar");
            _divBar.setAttribute("data-transitiongoal", _datasource[i].Progresso);
            _divBar.setAttribute("style", "width: " + _datasource[i].Progresso + "%");
            _divBar.setAttribute("aria-valuenow", _datasource[i].Progresso);

            var _legend = window.document.createElement("small");
            _legend.innerHTML = _datasource[i].Progresso + " % Complete";

            var _divProgress = window.document.createElement("div");
            _divProgress.setAttribute("class", "progress progress_sm");
            _divProgress.appendChild(_divBar);

            var row = _printTable.insertRow(linha);
          
            var cell0 = row.insertCell(0);
           
            var cell1 = row.insertCell(1);
            cell1.setAttribute("class", "project_progress");


            var cell2 = row.insertCell(2);
            cell2.setAttribute("width", "30px");
            cell2.setAttribute("align", "center");

            var cell3 = row.insertCell(3);
            cell3.setAttribute("width", "100px");
            cell3.setAttribute("align", "right");

            cell0.innerHTML = _datasource[i].Descricao;
            cell1.appendChild(_divProgress);
            cell1.appendChild(_legend);
            cell2.innerHTML = _datasource[i].Estimativa;
            cell3.appendChild(_divEtapas);
        }
    }

    var _limpar = function () {
        var tableHeaderRowCount = 1;
        var rowCount = _printTable.rows.length;
        for (var i = tableHeaderRowCount; i < rowCount; i++) {
            _printTable.deleteRow(tableHeaderRowCount);
        }
    }

    var _listar = function () {
        return _datasource;
    }

    return {
        create: _create,
        listar: _listar
    }
})();