var ctrTarefa = (function () {
    var _idEdit = 0;
    var _idExcluir = 0;
    var _table = {};
    var _datasource = [];
    var _txtNomeTarefa = {};
    var _confirmDeleteTarefa = {};
    var _projeto = {};
    var _txtEstimativa = {};
    var _progresso = 0;
    var _cbKMS = {};
    var _cbPrism = {};
    var _cbAprovado = {};
 

    var _create = function (projeto) {
        _projeto = projeto;
        _confirmDeleteTarefa = ConfirmDelete();
        _confirmDeleteTarefa.create("editTarefa", "Tarefa");

        createTable();
        createEdit();
        _datasource = _projeto.tarefas;
        _tableDataBind.call(this);

    }

    function createEdit() {

        init_IonRangeSlider();
    
        _txtEstimativa = window.document.getElementById("txtEstimativa");
        _txtEstimativa.onchange = _txtEstimativaValidade;
        _txtEstimativa.onkeyup = _txtEstimativaValidade;
        _txtEstimativa.setAttribute("maxlength", "10");

        _cbKMS = window.document.getElementById("cbKMS");
        _cbPrism = window.document.getElementById("cbPrism");
        _cbAprovado = window.document.getElementById("cbAprovado");
       

        _txtNomeTarefa = window.document.getElementById("txtNomeTarefa");
        _txtNomeTarefa.onchange = _txtNomeTarefaValidade;
        _txtNomeTarefa.onkeyup = _txtNomeTarefaValidade;
        _txtNomeTarefa.setAttribute("maxlength", "50");
        _resetValidation.call(this);
    }

  
    function createTable() {
        /*table vai na div principal*/

        var _divTableTarefa = window.document.getElementById("divTableTarefa");

        _table = window.document.getElementById("TarefaTable");
        if (_table) _table.remove();

        _table = window.document.createElement("table");
        _table.setAttribute("class", "table table-striped table-hover table-responsive");
        _table.setAttribute("id", "TarefaTable")

        var row = _table.insertRow(0);
        var cell0 = row.insertCell(0);
        var cell1 = row.insertCell(1);
        var cell2 = row.insertCell(2);
        var cell3 = row.insertCell(3);
        var cell4 = row.insertCell(4);
        var cell5 = row.insertCell(5);
        cell0.innerHTML = "codigo";
        cell1.innerHTML = "Tarefa";
        cell2.innerHTML = "Progresso";
        cell3.innerHTML = "Estimativa";
        cell4.innerHTML = "Editar";
        cell5.innerHTML = "Excluir";
        _divTableTarefa.appendChild(_table);
        
    }

    var _tableDataBind = function () {
        _limpar.call(this);
         
        var linha = 0;
        for (var i = 0; i < _datasource.length; i++) {
            linha++;

            _divBar = window.document.createElement("div");
            _divBar.setAttribute("class", "progress-bar bg-blue");
            _divBar.setAttribute("role", "progressbar");
            _divBar.setAttribute("data-transitiongoal", _datasource[i].Progresso);
            _divBar.setAttribute("style", "width: " + _datasource[i].Progresso + "%");
            _divBar.setAttribute("aria-valuenow", _datasource[i].Progresso);

            _legend = window.document.createElement("small");
            _legend.innerHTML = _datasource[i].Progresso + " % Complete";

            _divProgress = window.document.createElement("div");
            _divProgress.setAttribute("class", "progress progress_sm");
            _divProgress.appendChild(_divBar);

            var row = _table.insertRow(linha);
            var cell0 = row.insertCell(0);
            cell0.setAttribute("width", "30px");

            var cell1 = row.insertCell(1);

            var cell2 = row.insertCell(2);
            cell2.setAttribute("class", "project_progress");
           

            var cell3 = row.insertCell(3);
            cell3.setAttribute("width", "30px");
            cell3.setAttribute("align", "center");

            var cell4 = row.insertCell(4);
            cell4.setAttribute("width", "30px");
            cell4.setAttribute("align", "center");

            var cell5 = row.insertCell(5);
            cell5.setAttribute("width", "30px");
            cell5.setAttribute("align", "center");


            cell0.innerHTML = _datasource[i].CodTarefa;
            cell1.innerHTML = _datasource[i].Descricao;
            cell2.appendChild(_divProgress);
            cell2.appendChild(_legend);
            cell3.innerHTML = _datasource[i].Estimativa;
            cell4.innerHTML = "<a href='#' onClick='ctrTarefa.editAt(" + _datasource[i].CodTarefa + ");return false;'><span class='glyphicon glyphicon-edit'></span></a></div>";
            cell5.innerHTML = "<a href='#' onClick='ctrTarefa.confirm(" + _datasource[i].CodTarefa + ");return false;'><span class='glyphicon glyphicon-trash'></span></a></div>";
        }
    }
   

    function init_IonRangeSlider() {

        if (typeof ($.fn.ionRangeSlider) === 'undefined') { return; }
        console.log('init_IonRangeSlider');

        $("#progresso").ionRangeSlider({
            type: "single",
            min: 0,
            max: 100,
            from: 0,
            keyboard: true,
            grid: true,
            onStart: function (data) {
                console.log("onStart");
            },
            onChange: function (data) {
                console.log("onChange");
            },
            onFinish: function (data) {
                _progresso = parseInt(data.from);
                //alert(_progresso);
            },
            onUpdate: function (data) {
                console.log("onUpdate");
            }
        });

    };

    var _limpar = function () {
        var tableHeaderRowCount = 1;
        var rowCount = _table.rows.length;
        for (var i = tableHeaderRowCount; i < rowCount; i++) {
            _table.deleteRow(tableHeaderRowCount);
        }
    }


    var _validate = function () {
        _formValid = 0;
        _formValid += _txtNomeTarefaValidade.call(this);
        _formValid += _txtEstimativaValidade.call(this);
        return (_formValid == 0);
    }

    var _txtNomeTarefaValidade = function () {
        if (_txtNomeTarefa.value.length > 0) {
            return _toggleValidade.call(this, _txtNomeTarefa, true, "");
        } else {
            return _toggleValidade.call(this, _txtNomeTarefa, false, "Erro na Descricao da Tarefa!!!");
        }
    }

    var _txtEstimativaValidade = function () {
        if (_txtEstimativa.value.length > 0) {
            return _toggleValidade.call(this, _txtEstimativa, true, "");
        } else {
            return _toggleValidade.call(this, _txtEstimativa, false, "Erro na Estimativa!!!");
        }
    }

    var _resetValidation = function () {
        _toggleValidade.call(this, _txtNomeTarefa, true, "");
        _toggleValidade.call(this, _txtEstimativa, true, "");

        $("#divAlertaTarefa").hide();
        _formValid = 0;
    }

    var _toggleValidade = function (input, valid, message) {
        var _div = $(input).parent();
        if (valid) {
            $(_div).removeClass("form-group has-error has-feedback");
            $(_div).find("span").hide();
            return 0;
        } else {
            $(_div).addClass("form-group has-error has-feedback");
            $(_div).find("span").show();
            $(_div).find("span")[1].innerHTML = message;
            return 1;
        }
    }

    function limparCampos() {
        _txtNomeTarefa.value = "";
        _txtEstimativa.value = "";
        _progresso = 0;
        _cbKMS.checked = false;
        _cbPrism.checked = false;
        _cbAprovado.checked = false;
    }

    var _newTarefa = function () {
        _idEdit = 0;
        limparCampos();

        var _slider = $("#progresso").data("ionRangeSlider");
        _slider.update({
            from: _progresso
        });

        $("#editCollapseTarefa").collapse('hide');
        $("#editCollapseItemTarefa").collapse('show');
        $("#btnNewTarefa").hide();
    }
    var _editClose = function () {
        $("#editCollapseTarefa").collapse('show');
        $("#editCollapseItemTarefa").collapse('hide');
        $("#btnNewTarefa").show();
    }
    var _editAt = function (id) {

        var _slider = $("#progresso").data("ionRangeSlider");

        for (var i = 0; i < _datasource.length; i++) {
            if (_datasource[i].CodTarefa === id) {
                _idEdit = id;
                _progresso = _datasource[i].Progresso;
                _txtNomeTarefa.value = _datasource[i].Descricao;
                _txtEstimativa.value = _datasource[i].Estimativa;
                _cbKMS.checked =_datasource[i].KMS;
                _cbPrism.checked = _datasource[i].PRISM;
                _cbAprovado.checked = _datasource[i].APPROVED;
        
                _slider.update({
                    from: _datasource[i].Progresso
                });
            }
        }
        $("#editCollapseTarefa").collapse('hide');
        $("#editCollapseItemTarefa").collapse('show');
        $("#btnNewTarefa").hide();
        _resetValidation.call(this);
    }

    var _save = function () {
        if (_validate.call(this)) {
            var _item = {
                CodTarefa: _idEdit,
                Descricao: _txtNomeTarefa.value,
                Estimativa: _txtEstimativa.value,
                Progresso: _progresso,
                KMS: _cbKMS.checked,
                PRISM: _cbPrism.checked,
                APPROVED: _cbAprovado.checked
            };

            _sabeDB(_item);
            limparCampos();
            _idEdit = 0;
            _tableDataBind.call(this);
            ProjetoProgressoAtualizar();

            $("#editCollapseTarefa").collapse('show');
            $("#editCollapseItemTarefa").collapse('hide');
            $("#btnNewTarefa").show();
        }
        else {
            $("#divAlertaTarefa").show();
        }
    }

    function _sabeDB(item) {
        if (item.CodTarefa !== 0) {
            for (var i = 0; i < _datasource.length; i++) {
                if (_datasource[i].CodTarefa === item.CodTarefa) {
                    _datasource[i].Descricao = item.Descricao;
                    _datasource[i].Estimativa = item.Estimativa;
                    _datasource[i].Progresso = item.Progresso;
                    _datasource[i].KMS =_cbKMS.checked;
                    _datasource[i].PRISM = _cbPrism.checked;
                    _datasource[i].APPROVED = _cbAprovado.checked;
                }
            }
        } else {
            item.CodTarefa = getMax();
            _datasource.push(item);
        }

    }

    function ProjetoProgressoAtualizar() {
        var itemProgresso = 0;
        var totalEstimativa = 0;
        var totalProgresso = 0;
        for (var i = 0 ; i < _datasource.length ; i++) {
            totalEstimativa += parseFloat(_datasource[i].Estimativa);
            itemProgresso = parseFloat(parseFloat(_datasource[i].Estimativa) * parseFloat(_datasource[i].Progresso) / 100);
            totalProgresso += itemProgresso;
            //totalProgresso += parseInt(_datasource[i].Progresso);
        }

        //alert(totalEstimativa +"-"+totalProgresso)
        var projetoProgresso = parseInt((totalProgresso * 100 / totalEstimativa));

        _projeto.Estimativa = totalEstimativa;
        _projeto.Progresso = projetoProgresso;
        ctrProjeto.dataBind();
    }


    var _confirm = function (id) {
        _idExcluir = id;
        for (var i = 0; i < _datasource.length; i++) {
            if (_datasource[i].CodTarefa === id) {
                _confirmDeleteTarefa.setMessage(_datasource[i].Descricao);
            }
        }
        _confirmDeleteTarefa.show();
        _resetValidation.call(this);
    }
    var _removeAt = function () {
        _deleteDB(_idExcluir);
        _idExcluir = 0;
        _confirmDeleteTarefa.hide();
        _resetValidation.call(this);
        _tableDataBind.call(this);
    }

    function _deleteDB(id) {
        for (var i = 0; i < _datasource.length; i++) {
            if (_datasource[i].CodTarefa === _idExcluir) {
                _datasource.splice(i, 1);
            }
        }
    }

    function getMax() {
        var max = 0;
        for (var i = 0 ; i < _datasource.length ; i++) {
            if (!max || parseInt(_datasource[i].CodTarefa) > parseInt(max))
                max = _datasource[i].CodTarefa;
        }
        return max + 1;
    }

    var _listar = function () {
        return _datasource;
    }

    return {
        create: _create,
        newTarefa: _newTarefa,
        editClose: _editClose,
        editAt: _editAt,
        save: _save,
        confirm: _confirm,
        removeAt: _removeAt,
        listar: _listar
    }
})();