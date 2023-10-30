window.$ = window.$ || jQuery;

var p2pcont = "#p2p_cont";

var p2p_ui_url = typeof TB_CONFIG !== "undefined" && typeof TB_CONFIG.p2p_ui_url !== "undefined" ? TB_CONFIG.p2p_ui_url : "http://10.24.2.12:5005/p2p-ui/";
var p2p_ui_url_cp = TB_CONFIG.p2p_ui_url_cp;

var isGoogleChartsLoaded = false;
var apiUrl = typeof TB_CONFIG !== "undefined" && typeof TB_CONFIG.p2p_api_url_cp !== "undefined" ? TB_CONFIG.p2p_api_url_cp : "http://p2p-qa.dev78.com:7005/p2p-api";
var java_pages = ['get_statistics', 'overview_page', 'account_statement_page', 'account_statement_grouped_page',  'account_statement_trans_page', 'my_investments_page', 'my_investments_page_mobile'];

(function($) {
    window.TB = window.TB || {};
    TB.API_URL = p2p_ui_url + "?p0=ui_trace";
    TB.request = null;
    TB.forms_submitted = {};
    if (typeof TB_CONFIG !== "undefined" && typeof TB_CONFIG.p2p_domain_errors_whitelist !== "undefined") {
        TB.CONFIG.WHITELISTED_ERROR_SOURCES = [ TB_CONFIG.p2p_domain_errors_whitelist ];
    }
    TB.p2p_get_account_balances_prev_session_token = "";
    console.log(TB);
    var sess_json = localStorage.getItem("session");
    try {
        var sess = JSON.parse(sess_json);
        if (typeof sess.session_token !== "undefined") {
            TB.session_token = sess.session_token;
        }
    } catch (err) {
        console.log("Parse error session");
    }
    if (TB.IS_LOADED_p2p_ui) return;
    TB.IS_LOADED_p2p_ui = true;
    TB.cache_hash = {};
    TB.account_balances = undefined;
    TB.initBootstrapSelect = function() {
        console.log("bootstrap_select init");
        $(".multiselect").selectpicker();
    };
    TB.initBootstrapDateTimePicker = function() {
        console.log("bootstrap_datetime_picker init");
        $(".input-group.date").datetimepicker({
            format: "YYYY-MM-DD",
            locale: TB.isDefined(TB.ui_lang.split("_")[0]) ? TB.ui_lang.split("_")[0] : "bg"
        });
    };
    TB.getRandomNumber = function() {
        return new Date().getTime() / 1e3 * Math.random();
    };
    $(document).on("keyup", ".p2p-form", function(e) {
        if (e.keyCode == 13) {
            $(this).find(".btn-submit").click();
        }
    });
    $(document).on("click", "#logout-btn", function() {
        TB.load({
            url: p2p_ui_url + "?" + "p0=logout&session_token=" + TB.session_token,
            method: "GET",
            alwaysCallback: function() {
                // localStorage.removeItem("session");
                TB.session_token = undefined;
                window.location = "/";
            }
        });
    });
    $(document).on("click", "#login-form-btn", function(e) {
        e.preventDefault();
        if ($("#login").hasClass("error") || $("#password").hasClass("error")) {
            return;
        }
        var data = $("#login-form").serialize();
        console.log(TB.ui_url);
        console.log("Data ", data, $("#loginEmail").val());
        var login = $("#login").val();
        var password = $("#password").val();
        var rand_req_num = TB.getRandomNumber();
        var request = $.ajax({
            type: "POST",
            url: p2p_ui_url + "?" + "p0=login",
            data: {
                login: login,
                password: password,
                grecaptcha_resp: "test"
            },
            async: true,
            success: function(result) {
                console.log("Result status ", result.length, result);
                console.log(window.location.href, window.location.href.split("?")[0] + "?" + result);
                var res = result;
                if (typeof res.result == "undefined" || typeof res.result.session_token == "undefined") {
                    alert("Invalid login");
                } else {
                    var session_token = res.result.session_token;
                    TB.session_token = res.result.session_token;
                    localStorage.setItem("session", JSON.stringify(res.result));
                    TRACE("Session token: ", TB.session_token);
                    p2p_load(TB.session_token, "primary_market_page", "bg_BG");
                    console.log("Success login ", TB.session_token);
                }
            },
            error: function(xhr, textStatus) {
                console.log("Text Status ", textStatus);
            }
        });
    });
    TB.setModalTitle = function() {
        jQuery(".modal-title").html(window.location.hostname);
    };
    TB.setModalBox = function(is_success) {
        var btn_class = "btn-default";
        if (is_success) {
            btn_class = "btn-success";
        }
        $("#action_error_modal").remove();
        $("#p2p_cont").prepend(' \t\t\t<div class="modal fade" id="action_error_modal"> \t\t\t<div class="modal-dialog"> \t\t\t<div class="modal-content"> \t\t\t<div class="modal-header"> \t\t\t<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button> \t\t\t<h4 class="modal-title"></h4> \t\t\t</div> \t\t\t<div class="modal-body"> \t\t\t</div> \t\t\t<div class="modal-footer"> \t\t\t<button type="button" class="btn ' + btn_class + '" data-dismiss="modal">Ok</button> \t\t\t</div> \t\t\t</div> \t\t\t</div> \t\t\t</div> \t\t');
        TB.setModalTitle();
    };
    TB.setModalConfirmBox = function(confirm_button_class, callback, params) {
        var cancel_btn_text = "Cancel";
        var confirm_btn_text = "Confirm";
        if (typeof params != "undefined") {
            if (typeof params.cancel_btn_text != "undefined") {
                cancel_btn_text = params.cancel_btn_text;
            }
            if (typeof params.confirm_btn_text != "undefined") {
                confirm_btn_text = params.confirm_btn_text;
            }
        }
        $("#action_error_modal").remove();
        $("#p2p_cont").prepend(' \t\t\t<div class="modal fade" id="action_error_modal"> \t\t\t<div class="modal-dialog"> \t\t\t<div class="modal-content"> \t\t\t<div class="modal-header"> \t\t\t<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button> \t\t\t<h4 class="modal-title"></h4> \t\t\t</div> \t\t\t<div class="modal-body"> \t\t\t</div> \t\t\t<div class="modal-footer"> \t\t\t<button type="button" class="btn btn-default p2p-btn-cancel" data-dismiss="modal">' + cancel_btn_text + '</button> \t\t\t<button type="button" class="btn btn-primary p2p-btn-confirm btn-ok ' + confirm_button_class + '">' + confirm_btn_text + "</a> \t\t\t</div> \t\t\t</div> \t\t\t</div> \t\t\t</div> \t\t");
        TB.setModalTitle();
        jQuery("." + confirm_button_class).click(function() {
            $(".modal-backdrop").remove();
            jQuery("#action_error_modal").modal("hide");
            callback();
        });
    };
    TB.numberWithSpaces = function(x) {
        var parts = x.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, "&nbsp;");
        return parts.join(".");
    };
    TB.uniqueId = function() {
        return "id-" + Math.random().toString(36).substr(2, 16);
    };
    TB.hash = function(string) {
        var hash = 0, i, chr, len;
        if (string.length === 0) return hash;
        for (i = 0, len = this.length; i < len; i++) {
            chr = string.charCodeAt(i);
            hash = (hash << 5) - hash + chr;
            hash |= 0;
        }
        return hash;
    };
    TB.msg = function(params) {
        ASSERT(typeof params.type == "string" && (params.type == "success" || params.type == "error"), {
            msg: "invalid params.type"
        });
        ASSERT(typeof params.msg == "string" && params.msg.length > 0, {
            msg: "invalid params.msg"
        });
        var modal = $("#tb_modal_" + params.type);
        var btnClass = params.type == "success" ? "btn-success" : "btn-default";
        if (modal.length === 0) {
            console.log("Before modal append ", p2pcont);
            $(p2pcont).append(' \t\t\t\t<div class="modal fade in tb-modal" id="tb_modal_' + params.type + '" tabindex="-1"> \t\t\t\t<div class="modal-dialog"> \t\t\t\t<div class="modal-content"> \t\t\t\t<div class="modal-header"> \t\t\t\t<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button> \t\t\t\t<h4 class="modal-title"></h4> \t\t\t\t</div> \t\t\t\t<div class="modal-body"> \t\t\t\t</div> \t\t\t\t<div class="modal-footer"> \t\t\t\t<button type="button" class="btn ' + btnClass + " tb-btn tb-btn-" + params.type + '" id="tb_btn_' + params.type + '" data-dismiss="modal">Ok</button> \t\t\t\t</div> \t\t\t\t</div> \t\t\t\t</div> \t\t\t\t</div> \t\t\t');
            modal = $("#tb_modal_" + params.type);
            console.log("Modal4e ", modal.html());
        }
        if (typeof params.title != "undefined") {
            ASSERT(typeof params.title == "string" && params.title.length > 0, {
                msg: "invalid params.title"
            });
            modal.find(".modal-title").html(params.title);
        }
        modal.find(".modal-body").html(params.msg);
        modal.modal("show");
    };
    TB.msgCP = function(params) {
        ASSERT(typeof params.type == "string" && (params.type == "success" || params.type == "error"), {
            msg: "invalid params.type"
        });
        ASSERT(typeof params.msg == "string" && params.msg.length > 0, {
            msg: "invalid params.msg"
        });
        var modal = $("#tb_modal_" + params.type);
        var btnClass = params.type == "success" ? "btn-success" : "btn-default";
        if (modal.length === 0) {
            console.log("Before modal append ", p2pcont);
            $(p2pcont).append(' \t\t\t\t<div class="modal fade in tb-modal" id="tb_modal_' + params.type + '" tabindex="-1"> \t\t\t\t<div class="modal-dialog"> \t\t\t\t<div class="modal-content"> \t\t\t\t<div class="modal-header"> \t\t\t\t<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button> \t\t\t\t<h4 class="modal-title"></h4> \t\t\t\t</div> \t\t\t\t<div class="modal-body"> \t\t\t\t</div> \t\t\t\t<div class="modal-footer"> \t\t\t\t<button onClick="window.location.reload(); window.scrollTo(0, 0);" type="button" class="btn ' + btnClass + " tb-btn tb-btn-" + params.type + '" id="tb_btn_' + params.type + '" data-dismiss="modal">Ok</button> \t\t\t\t</div> \t\t\t\t</div> \t\t\t\t</div> \t\t\t\t</div> \t\t\t');
            modal = $("#tb_modal_" + params.type);
            console.log("Modal4e ", modal.html());
            $("#tb_modal_success").on('hide.bs.modal', function(){
                window.location.reload();
            });
        }
        if (typeof params.title != "undefined") {
            ASSERT(typeof params.title == "string" && params.title.length > 0, {
                msg: "invalid params.title"
            });
            modal.find(".modal-title").html(params.title);
        }
        modal.find(".modal-body").html(params.msg);
        modal.modal("show");
    };
    TB.confirm = function(msg, callback, params) {
        var modal = $("#tb_modal_confirm");
        var cancelBtnText = "Cancel";
        var confirmBtnText = "Confirm";
        if (TB.isDefined(params)) {
            ASSERT(TB.isObject(params));
            if (TB.isDefined(params.cancelBtnText)) {
                ASSERT(TB.isString(params.cancelBtnText));
                cancelBtnText = params.cancelBtnText;
            }
            if (TB.isDefined(params.confirmBtnText)) {
                ASSERT(TB.isString(params.confirmBtnText));
                confirmBtnText = params.confirmBtnText;
            }
        }
        if (modal.length === 0) {
            $(p2pcont).append(' \t\t\t\t<div class="modal fade in tb-modal" id="tb_modal_confirm" tabindex="-1"> \t\t\t\t<div class="modal-dialog"> \t\t\t\t<div class="modal-content"> \t\t\t\t<div class="modal-header"> \t\t\t\t<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button> \t\t\t\t<h4 class="modal-title"></h4> \t\t\t\t</div> \t\t\t\t<div class="modal-body"> \t\t\t\t</div> \t\t\t\t<div class="modal-footer"> \t\t\t\t<button type="button" class="btn btn-default tb-btn tb-btn-cancel" id="tb_btn_cancel">' + cancelBtnText + '</button> \t\t\t\t<button type="button" class="btn btn-primary tb-btn tb-btn-confirm" id="tb_btn_confirm">' + confirmBtnText + "</button> \t\t\t\t</div> \t\t\t\t</div> \t\t\t\t</div> \t\t\t\t</div> \t\t\t");
            modal = $("#tb_modal_confirm");
        }
        $(document).off("click", "#tb_btn_cancel").on("click", "#tb_btn_cancel", function(e) {
            e.preventDefault();
            modal.modal("hide");
        });
        $(document).off("click", "#tb_btn_confirm").on("click", "#tb_btn_confirm", function(e) {
            e.preventDefault();
            modal.modal("hide");
            callback();
        });
        modal.find(".modal-body").html(msg);
        modal.find(".tb-btn-cancel").html(cancelBtnText);
        modal.find(".tb-btn-confirm").html(confirmBtnText);
        modal.modal("show");
    };
    TB.showModalBox = function(msg, confirm_class) {
        jQuery("#action_error_modal").find(".modal-body").text(msg);
        jQuery("#action_error_modal").modal("show");
    };
    TB.p2pConfirm = function(msg, callback, params) {
        TB.setModalConfirmBox("confirm_withdraw_btn", callback, params);
        TB.showModalBox(msg);
    };
    TB.reloadScripts = function() {
        var scriptTag = document.getElementsByTagName("script");
        var src;
        for (var i = 0; i < scriptTag.length; i++) {
            src = scriptTag[i].src;
            scriptTag[i].parentNode.removeChild(scriptTag[i]);
            try {
                var x = document.createElement("script");
                x.type = "text/javascript";
                x.src = src;
                document.getElementsByTagName("head")[0].appendChild(x);
            } catch (e) {}
        }
    };
    TB.getCookie = function(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(";");
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == " ") {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    };
    TB.setUILang = function() {
        var qlang = TB.getCookie("pll_language");
        var urlParser = document.createElement("a");
        urlParser.href = window.location.href;
        console.log("URL Parser ", urlParser.pathname.split("/"));
        var urlLang = urlParser.pathname.split("/")[1];
        if (typeof urlLang !== "undefined" && urlLang.length == 2) {
            qlang = urlLang;
            console.log("URL Lang ", qlang);
        }
        TB.qlang = qlang;
        if (qlang == "en") {
            TB.ui_lang = "en_US";
        } else if (qlang == "bg") {
            TB.ui_lang = "bg_BG";
        } else if (qlang == "et") {
            TB.ui_lang = "et_EE";
        } else if (qlang == "es") {
            TB.ui_lang = "es_ES";
        } else if (qlang == "de") {
            TB.ui_lang = "de_DE";
        }
    };
    TB.p2pLangLinkRepair = function() {
        if (!TB.isDefined(TB.qlang)) {
            TB.setUILang();
        }
        ASSERT(TB.isDefined(TB.qlang));
        ASSERT(TB.isDefined(TB.ui_lang));
        $(".p2p-lang-link").each(function(i, obj) {
            var href = $(obj).attr("href");
            var regex1 = new RegExp("^/" + TB.qlang + "/", "i");
            var regex2 = new RegExp("^http", "i");
            var regex3 = new RegExp("^/");
            if (!regex1.test(href) && !regex2.test(href)) {
                if (regex3.test(href)) {
                    href = "/" + TB.qlang + href;
                } else {
                    href = "/" + TB.qlang + "/" + href;
                }
                console.log("Hreff s", href);
                $(obj).attr("href", href);
            }
        });
    };
    $(document).on("tbp2p_lang_link_repair", function(e) {
        TB.p2pLangLinkRepair();
    });
    TB.loadContent = function(url, method, data, form_name, extraParams) {
        if (typeof TB.setUILang !== "undefined") {
            TB.setUILang();
        }
        console.log("Load content ", method, TB.ui_lang, typeof TB.setUILang);
        var reqId;
        if (typeof extraParams !== "undefined" && extraParams.reqId !== "undefined") {
            reqId = extraParams.reqId;
        }
        TRACE("URL", url);
        ASSERT(typeof url === "string" && url.length, {
            msg: "url is invalid"
        });
        TRACE("METHOD", method);
        ASSERT(typeof method === "string" && /^GET|POST$/.test(method), {
            msg: "method is invalid"
        });
        var queryString = "?" + url.split(/\?|#/, 2)[1];
        var queryParams = TB.parseQueryParams(queryString);
        console.log("queryParams", queryParams);
        console.log("Query Stringz ", queryString);

        if (TB.isDefined(queryParams.p0)) {
            if (java_pages.includes(queryParams.p0)) {
                if (url.includes(p2p_ui_url)) {
                    url = url.replace(p2p_ui_url, p2p_ui_url_cp)
                }
            }
        };

        TB.ui_lang = TB.isDefined(TB.ui_lang) && !TB.isDefined(queryParams.lang) ? TB.ui_lang : TB.isDefined(queryParams.lang) ? queryParams.lang : "bg_BG";
        url = url.indexOf("lang=") !== -1 ? url : url + ";lang=" + TB.ui_lang;
	var sess_json = localStorage.getItem('session');
        try {
            var sess = JSON.parse(sess_json);
            if(typeof sess.session_token !== 'undefined') {
                TB.session_token = sess.session_token;
            }
        } catch(err) {
            console.log("Parse error session");
        }
        if (TB.isDefined(queryParams.p2) && queryParams.p2 != "undefined") {
            if (!TB.isDefined(TB.session_token) || TB.session_token != queryParams.p2) {
		localStorage.removeItem('session');
                TB.session_token = undefined;
                window.location.href = "login";
                return false;
            }
        }
        if (!TB.isDefined(queryParams.p2) && TB.isDefined(TB.session_token)) {
            url = url + ";p2=" + TB.session_token;
        }
        TRACE("URL_WITH_LANG", url);
        if (method == "POST") {
            console.log("Update investor balance ", method);
            TB.p2p_get_account_balances();
            console.log("Update investor balance END", method);
        }
        if ($("#p2p_loading_indicator").length === 0) {
            console.log("P2P Cont Length ", $(p2pcont).length);
            var p2p_loader_intr = setInterval(function() {
                if ($(p2pcont).length > 0) {
                    $(p2pcont).prepend('<img src="' + TB_CONFIG.p2p_cdn_url + 'img/rolling.svg" id="p2p_loading_indicator" style="display:none; position: fixed; top: 50%; left: 50%; z-index: 999999;">');
                    clearInterval(p2p_loader_intr);
                }
            }, 100);
        }
        var successCallback = function(ags) {
            TRACE("HTML CONTENT IS INJECTED IN P2P_CONT");
            TB.initBootstrapDateTimePicker();
            TB.initBootstrapSelect();
            $("select, input, textarea, button").attr("disabled", false);
            $("#investor_account_id").trigger("change");
            $(".my-investment-amount").trigger("change");
            $(".p2p-input-confirm-sale-premium-perc").trigger("change");
            $("body").tooltip({
                selector: "[data-toggle=tooltip]"
            });
            $(".p2p-tooltip-info").tooltip();
            TB.cleanModalEffects();
            if (typeof $(".p2p-my-investment-doc-popup").html() !== "undefined") {
							$('[data-toggle="popover"]').popover({
								html: true,
								container: "body",
								content: function() {
										return $(this).next(".p2p-my-investment-doc").html();
								}
							});
            }
            var header_height = $(".iuvo-navbar").height();
            if (url.indexOf("page_num") !== -1) {
                $("html, body").animate({
                    scrollTop: $(".p2p-table").offset().top - header_height
                }, "slow");
            }
        };
        var alwaysCallback = function() {
            if (typeof form_name != "undefined") {
                TB.forms_submitted[form_name] = false;
            }
        };
        var errorCallback = function(ags) {
            ASSERT(typeof ags.msg !== "undefined");
            console.log("Error callback Args ", ags);
            if (typeof ags.code !== "undefined" && (ags.code === "RMA003" || ags.code === "PEERERR060")) {
                // localStorage.removeItem("session");
                window.location.href = "login";
            } else {
                TB.setModalBox();
                TB.showModalBox(ags.msg);
            }
        };
        var screenWidth = window.innerWidth;
        var screenHeight = window.innerHeight;
        if (typeof data == "undefined") {
            data = {};
        }
        data.screen_width = screenWidth;
        data.screen_height = screenHeight;
        TB.load({
            url: url,
            method: method,
            data: data,
            contSelector: p2pcont,
            successCallback: successCallback,
            alwaysCallback: alwaysCallback,
            loadingIndicatorSelector: "#p2p_loading_indicator",
            errorCallback: errorCallback,
            overlaySelector: "#overlay",
            reqId: reqId,
            reqMode: "serial",
            reqType: "ui"
        });
    };
    crossroads.addRoute("/{query}", function(query) {
        console.log("Crossroads Query ", query);
        var url = p2p_ui_url + "app?" + query;
        var re = new RegExp("^p0=cart_page");
        if (re.test(query)) {
            var rand = Math.random();
            url = url + ";rnd=" + rand;
        }
        TB.loadContent(url, "GET");
    });
    hasher.initialized.add(function(h) {
        crossroads.parse(h);
    });
    hasher.changed.add(function(newHash, oldHash) {
        console.log("oldHash", oldHash);
        console.log("newHash", newHash);
        var oldHashParams = TB.parseQueryParams("?" + oldHash);
        console.log("oldHashParams", oldHashParams);
        if (TB.isDefined(oldHashParams.cart) && TB.isDefined(oldHashParams.loan_information) || TB.isDefined(oldHashParams.loan_information)) {
            TB.hideModal("#p2p_loan_information_modal");
        } else if (TB.isDefined(oldHashParams.cart)) {
            TB.hideModal("#p2p_cart_modal");
        } else {
            crossroads.parse(newHash);
        }
    });
    hasher.init();
    TB.setHash = function(hash, extraParams) {
        var oldHash = hasher.getHash();
        var newHash = hash;
        TB.setHashSilently(hash);
        var oldHashParams = TB.parseQueryParams("?" + oldHash);
        console.log("oldHashParams", oldHashParams);
        if (TB.isDefined(oldHashParams.cart) && TB.isDefined(oldHashParams.loan_information) || TB.isDefined(oldHashParams.loan_information)) {
            TB.hideModal("#p2p_loan_information_modal");
        } else if (TB.isDefined(oldHashParams.cart)) {
            TB.hideModal("#p2p_cart_modal");
        } else {
            console.log("New TB.setHash", newHash);
            var url = p2p_ui_url + "app?" + newHash;
            TB.loadContent(url, "GET", undefined, undefined, extraParams);
        }
    };
    TB.setHashSilently = function(hash) {
        console.log("TB.setHashSilently", hash);
        hasher.changed.active = false;
        hasher.setHash(hash);
        hasher.changed.active = true;
    };
    TB.cleanModalEffects = function() {
        $("body").removeClass("modal-open");
        $(".modal-backdrop").remove();
    };
    TB.hideModal = function(selector) {
        console.log("hiding modal", selector);
        var modal = $(selector);
        if (modal.length > 0) {
            modal.modal("hide");
        }
        TB.cleanModalEffects();
    };
    $(document).on("hidden.bs.modal", "#p2p_cart_modal", function(e) {
        var queryParams = TB.parseQueryParams(window.location.hash.replace("/", ""));
        delete queryParams["cart"];
        var hash = TB.queryParamsToHash(queryParams);
        TB.setHashSilently(hash);
    });
    $(document).on("hidden.bs.modal", "#p2p_loan_information_modal", function(e) {
        var queryParams = TB.parseQueryParams(window.location.hash.replace("/", ""));
        delete queryParams["loan_information"];
        var hash = $.map(Object.getOwnPropertyNames(queryParams), function(k) {
            var mstr = "";
            if (queryParams[k].constructor === Array) {
                for (var i = 0; i < queryParams[k].length; i++) {
                    mstr = mstr + ";" + k + "=" + queryParams[k][i] + ";";
                }
                return mstr;
            } else {
                return [ k, queryParams[k] ].join("=");
            }
        }).join(";");
        TB.setHashSilently(hash);
    });
    $(document).on("click", ".p2p-link", function(e) {
        e.preventDefault();
        var hash = $(this).attr("href");
        hasher.setHash(hash);
    });
    $(document).on("click", ".borrow_coll_li", function(e) {
        $(".payment_schedule_li").removeClass("active");
        $(".investment_breakdown_li").removeClass("active");
        $(this).addClass("active");
        $(".investment_breakdown_div").hide();
        $(".pay_schedule_div").hide();
        $(".borrow_coll_div").show();
    });
    $(document).on("click", ".payment_schedule_li", function(e) {
        $(".borrow_coll_li").removeClass("active");
        $(".investment_breakdown_li").removeClass("active");
        $(this).addClass("active");
        $(".borrow_coll_div").hide();
        $(".investment_breakdown_div").hide();
        $(".pay_schedule_div").show();
    });
    $(document).on("click", ".investment_breakdown_li", function(e) {
        $(".borrow_coll_li").removeClass("active");
        $(".payment_schedule_li").removeClass("active");
        $(this).addClass("active");
        $(".borrow_coll_div").hide();
        $(".pay_schedule_div").hide();
        $(".investment_breakdown_div").show();
    });
    $(document).on("click", ".withdraw-history-btn", function(e) {
        $(".withdraw-history-tbl").toggle("slow");
    });
    $(document).on("change", ".p2p-withdraw-page #p2p_withdraw_form #investor_account_id", function(e) {
        var selectedOption = $(this).find(":selected");
        console.log(selectedOption);
        var investorAccountAmount = selectedOption.data("investor-account-id-amount");
        console.log("investorAccountAmount: ", investorAccountAmount);
        var investorAccountCurrencyCode = selectedOption.data("investor-account-id-currency-code");
        console.log("investorAccountCurrencyCode: ", investorAccountCurrencyCode);
        if (typeof investorAccountAmount == "undefined") {
            console.log("Undefined investorAccountAmount");
            return false;
        }
        if (typeof investorAccountCurrencyCode == "undefined") {
            console.log("Undefined investorAccountCurrencyCode");
            return false;
        }
        $(".p2p-withdraw-page #p2p_withdraw_form .p2p-investor-account-trans-banks").hide();
        $(".p2p-withdraw-page #p2p_withdraw_form #withdraw_amount").val(investorAccountAmount);
        $(".p2p-withdraw-page #p2p_withdraw_form #withdraw_amount_currency_code").html(investorAccountCurrencyCode);
        $(".p2p-withdraw-page #p2p_withdraw_form #investor_account_trans_banks_" + selectedOption.val()).show();
    });
    $(document).on("change", "#file", function(e) {
        var confirmMsg = $(this).data("confirm-msg");
        if (typeof confirmMsg === "undefined") {
            console.log("undefined data attr confirm-msg");
            return false;
        }
        var fileTooBigMsg = $(this).data("file-too-big-msg");
        if (typeof fileTooBigMsg === "undefined") {
            console.log("undefined data attr file-too-big-msg");
            return false;
        }
        if (confirm(confirmMsg)) {
            var reader = new FileReader();
            var file = $(this)[0].files[0];
            var url = $(this).data("p2p-url");
            if (typeof url === "undefined") {
                console.log("undefined data attr p2p-url");
                return false;
            }
            if (file.size > 5242880) {
                TB.setModalBox(true);
                TB.showModalBox("You try to upload file bigger than 5 MB !");
                return false;
            }
            reader.onload = function(e) {
                var fileEncodedContent = reader.result.split(",", 2)[1];
                TB.loadContent(url, "POST", {
                    file_content: fileEncodedContent
                });
                return fileEncodedContent;
            };
            reader.readAsDataURL(file);
        }
    });
    Number.prototype.toFixedDown = function(digits) {
        var re = new RegExp("(\\d+\\.\\d{" + digits + "})(\\d)"), m = this.toString().match(re);
        return m ? parseFloat(m[1]) : this.valueOf();
    };
    TB.calculateSellExpectedReturn = function() {
        var sellAmount = Number($("#p2p-my-investments-confirm-sell-form #sell_amount").val());
        var premiumPerc = Number($("#p2p-my-investments-confirm-sell-form #premium_perc").val());
        if (isNaN(sellAmount)) {
            console.log("invalid sell_amount: ", sellAmount);
            return false;
        }
        if (isNaN(premiumPerc)) {
            console.log("invalid premium_perc: ", premiumPerc);
            return false;
        }
        var discountPremium = premiumPerc / 100 * sellAmount;
        discountPremium = Math.abs(discountPremium);
        var expectedReturn = premiumPerc > 0 ? sellAmount + discountPremium : sellAmount - discountPremium;
        return expectedReturn.toFixedDown(2);
    };
    $(document).on("input", ".p2p-my-investments-confirm-sele-page #p2p-my-investments-confirm-sell-form #sell_amount", function(e) {
        $("#p2p-my-investments-confirm-sell-form #expected_return").val(TB.calculateSellExpectedReturn());
    });
    $(document).on("input", ".p2p-my-investments-confirm-sele-page #p2p-my-investments-confirm-sell-form #premium_perc", function(e) {
        $("#p2p-my-investments-confirm-sell-form #expected_return").val(TB.calculateSellExpectedReturn());
    });
    $(document).on("change keyup", ".p2p-input-loan-invest-amount", function(e) {
        var loanId = Number($(this).data("loan-id"));
        var loanInvestAmount = Number($(this).val());
        var loanMinInvestAmount = Number($(this).data("loan-min-invest-amount"));
        var btnLoanConfirmInvest = $("#p2p_btn_loan_confirm_invest_" + loanId);
        var btnInvestAll = $("#p2p_btn_invest_all");
        if (loanInvestAmount >= loanMinInvestAmount) {
            btnLoanConfirmInvest.removeClass("disabled");
            btnInvestAll.removeClass("disabled");
        } else {
            btnLoanConfirmInvest.addClass("disabled");
            btnInvestAll.addClass("disabled");
        }
    });
    $(document).on("shown.bs.modal", "#action_error_modal", function(e) {
        $(this).focus();
    });
    $(document).on("shown.bs.modal", "#confirm_modal", function(e) {
        $(this).focus();
    });
    $(document).on("change keyup", ".my-investment-amount", function(e) {
        e.preventDefault();
        var currencyCode = $(this).data("currency-code");
        var loansInvestsSum = 0;
        $(".my-investment-amount").each(function() {
            if ($(this).data("currency-code") == currencyCode) {
                loansInvestsSum += Number($(this).val());
            }
        });
        $("#loans_invests_sum_" + currencyCode).val(loansInvestsSum);
        $("#loans_invests_sum_" + currencyCode).trigger("change");
    });
    var p2pInputDecimalLastValue = "";
    $(document).off("change", ".p2p-input-decimal").on("change", ".p2p-input-decimal", function(e) {
        var input = $(this);
        var type = $(this).data("type");
        console.log("Type Change ", type);
        if (typeof type !== "undefined" && type == "int") {
            return;
        }
        if (input.val() && input.val() != p2pInputDecimalLastValue) {
            p2pInputDecimalLastValue = Number(input.val().replace(",", ".")).toFixed(2);
            p2pInputDecimalLastValue = isNaN(p2pInputDecimalLastValue) ? "0.00" : p2pInputDecimalLastValue;
            input.val(p2pInputDecimalLastValue);
        }
    });
    TB.rgb2Hex = function(rgb) {
        rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
        return rgb && rgb.length === 4 ? "#" + ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) + ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) + ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : "";
    };
    TB.p2p_get_session = function() {
        var session_str = localStorage.session;
        if (typeof session_str !== "undefined") {
            session = JSON.parse(session_str);
            return session;
        }
        return undefined;
    };
    TB.p2p_get_statistics = function() {
        console.log("GET STATISTICSSSS");
        $(document).ready(function() {
            if ($("#total-amount").length || $("#invested").length || $("#total_investments_amount").length || $("#total_loans_listed_amount").length) {
                TB.load({
                    url: p2p_ui_url_cp + "?" + "p0=get_statistics",
                    method: "GET",
                    successCallback: function(data) {
                        console.log("Get Statistics Data ", data);
                        data = data.data;
                        if (typeof data.status != "undefined" && data.status.status == "ok" && typeof data.result.total_listed_loans_amount != "undefined" && typeof data.result.total_loans_invested_amount != "undefined") {
                            $("#total-amount .value").html("€ " + TB.numberWithSpaces(data.result.total_listed_loans_amount));
                            $("#invested .value").html("€ " + TB.numberWithSpaces(data.result.total_loans_invested_amount));
                            $("#total_investments_amount").html(TB.numberWithSpaces(data.result.total_loans_invested_amount));
                            $("#total_loans_listed_amount").html(TB.numberWithSpaces(data.result.total_listed_loans_amount));
                        } else if (typeof data.status !== "undefined") {}
                    }
                });
            }
        });
    };
    TB.p2p_get_account_balances = function(hasCache) {
        var session_str = localStorage.session;
        var cache = "";
        if (typeof hasCache !== "undefined" && hasCache) {
            var rndNum = TB.getRandomNumber();
            cache = "&rnd=" + rndNum;
        }
        if (typeof session_str !== "undefined") {
            session = JSON.parse(session_str);
            var session_token = session.session_token;
            console.log("Timeout call p2p_get_account_balances ", session_token);
            if (typeof session_token !== "undefined" && TB.p2p_get_account_balances_prev_session_token != session_token && session_token == TB.session_token) {
                jQuery.get(p2p_ui_url + "?p0=get_account_balance&p2=" + session_token + cache, function(data) {
                    console.log("Get Account balances ", data);
                    if (data.status.status == "ok" && typeof data.result.balances != "undefined") {
                        TB.account_balances = data.result.balances;
                        var event = TB.createNewEvent("tbp2p_account_balances");
                        event.tbp2p_account_balances = data.result.balances;
                        event.tbp2p_session_info = data.result.session_info;
                        event.tbp2p_cart_count = data.result.cart_count;
                        event.detail = {
                            tbp2p_account_balances: data.result.balances,
                            tbp2p_session_info: data.result.session_info,
                            tbp2p_cart_count: data.result.cart_count
                        };
                        document.dispatchEvent(event);
                    } else if (typeof data.status !== "undefined" && data.status.code == "RMA003") {
                        TB.p2p_get_account_balances_prev_session_token = session_token;
                        // localStorage.removeItem("session");
                        TB.session_token = undefined;
                    }
                });
            }
        } else {
            console.log("No session");
        }
    };
    TB.createNewEvent = function(eventName) {
        var event;
        if (typeof Event === "function") {
            event = new Event(eventName);
        } else {
            event = document.createEvent("Event");
            event.initEvent(eventName, true, true);
        }
        return event;
    };
    console.log("set Timeout 20000");
    console.log("GETINVESTOR");
    $.ajax({
        async: false,
        url: apiUrl + "getInvestor",
        data: {p2: TB.session_token},
        type: 'GET',
        dataType: "json",
        success: function (data) {
            localStorage.setItem('investor_lvl_id', data.investorLevelId);
        }
    })
    setInterval(TB.p2p_get_account_balances, 2e4);
    $(document).on("tbp2p_update_account_balances", function(e) {
        TB.p2p_get_account_balances(true);
    });
    TB.p2pBtnDisableOnEmptyInputs = function(btnId, inputClass) {
        $(document).on("change keyup", "." + inputClass, function(e) {
            var p2pBtn = $("#" + btnId);
            var p2pBtnDisabled = true;
            $("." + inputClass).each(function(e) {
                if (p2pBtnDisabled) {
                    var p2pInputVal = $(this).val();
                    p2pBtnDisabled = typeof p2pInputVal === "undefined" || p2pInputVal.length == 0 ? true : false;
                }
                return p2pBtnDisabled;
            });
            p2pBtn.prop("disabled", p2pBtnDisabled);
            if (p2pBtnDisabled === true) {
                p2pBtn.addClass("disabled");
            } else {
                p2pBtn.removeClass("disabled");
            }
        });
    };
    $(document).on("click", "#sell_all_btn", function(e) {
        e.preventDefault();
        var hash = "";
        var confirmSaleSess = $(this).data("confirm-sell-sess");
        var cgiParamsStr = $(this).data("cgi-params-str");
        $(".p2p-input-loan-sell-amount").each(function(e) {
            var loanId = $(this).data("loan-id");
            console.log("Loan id ", loanId);
            var loanSellAmount = $(this).val();
            cgiParamsStr += typeof loanSellAmount !== "undefined" && loanSellAmount.length > 0 ? "loan_id_sell=" + loanId + ";sell_amount=" + loanSellAmount + ";" : "";
        });
        hasher.setHash(confirmSaleSess + ";" + cgiParamsStr + ";");
    });
    $(document).on("click", "#p2p_btn_invest_all", function(e) {
        var hash = $(this).data("hash");
        $(".p2p-input-loan-invest-amount").each(function(e) {
            var queryParams = $(this).data("query-params");
            var loanInvestAmount = $(this).val();
            hash += typeof loanInvestAmount !== "undefined" && loanInvestAmount.length > 0 ? queryParams + ";amount=" + loanInvestAmount + ";" : "";
        });
        hasher.setHash(hash);
    });
    TB.p2pBtnDisableOnEmptyInputs("p2p_btn_invest_all", "p2p-input-loan-invest-amount");
    TB.p2pBtnDisableOnEmptyInputs("sell_all_btn", "p2p-input-loan-sell-amount");
    $(document).on("change", ".p2p-input-checkbox-notification", function(e) {
        var data = {
            notification_id: $(this).data("notification-id"),
            notification_enabled: $(this).val() == 1 ? 0 : 1
        };
        TB.loadContent($(this).data("url"), "POST", data);
    });
    TB.clearFields = function() {
        $(".p2p-select").val([]);
        $(".p2p-input").val([]);
        $(".p2p-select").selectpicker("refresh");
    };
    $(document).off("click", "#p2p_btn_filters_clear").on("click", "#p2p_btn_filters_clear", function(e) {
        TB.clearFields();
    });
    TB.formatCents = function(valCentsString) {
        TRACE("valCentsString", valCentsString);
        ASSERT(typeof valCentsString === "string" && valCentsString.length > 0, {
            msg: "valCentsString is invalid"
        });
        var dotIndex = valCentsString.indexOf(".");
        valCentsString = valCentsString.substring(0, dotIndex != -1 ? dotIndex : valCentsString.length);
        var valCentsIntString = parseInt(valCentsString).toString();
        TRACE("valCentsIntString", valCentsIntString);
        var valDollarsString = valCentsIntString.length < 3 ? valCentsIntString + ".00" : [ valCentsIntString.slice(0, -2), ".", valCentsIntString.slice(-2) ].join("");
        TRACE("valDollarsString", valDollarsString);
        return valDollarsString;
    };
    TB.formatCurrency = function(val) {
        return parseFloat(Math.floor(val * 100) / 100).toFixed(2);
    };
    TB.isNumeric = function(val) {
        return !isNaN(parseFloat(val)) && isFinite(val);
    };
    TB.isInt = function(val) {
        return Number(val) === val && val % 1 === 0;
    };
    TB.isFloat = function(val) {
        return Number(val) === val && val % 1 !== 0;
    };
    var stackModal = 0;
    $(document).on("show.bs.modal", ".modal", function(event) {
        var zIndex = 1040 + 10 * $(".modal:visible").length;
        $(this).css("z-index", zIndex);
        stackModal++;
        setTimeout(function() {
            $(".modal-backdrop").not(".modal-stack").css("z-index", zIndex - 1).addClass("modal-stack");
        }, 0);
    });
    $(document).on("hidden.bs.modal", ".modal", function(event) {
        stackModal--;
        if (stackModal > 0) {
            $("body").addClass("modal-open");
        } else {
            $("body").removeClass("modal-open");
        }
    });
    TB.inputNumeric = function(inputElementId, useCommaAsDecimalSeparator) {
        var textbox = document.getElementById(inputElementId);
        textbox.addEventListener("keydown", function _OnNumericInputKeyDown(e) {
            var key = e.which || e.keyCode;
            if (!e.shiftKey && !e.altKey && !e.ctrlKey && key >= 65 && key <= 90 || key == 32) {
                e.preventDefault();
                return false;
            }
            if (!e.shiftKey && !e.altKey && !e.ctrlKey && key >= 48 && key <= 57 || key >= 96 && key <= 105 || e.keyCode == 65 && e.ctrlKey === true || key == 67 && e.ctrlKey === true || key == 88 && e.ctrlKey === true || key >= 35 && key <= 39 || key == 8 || key == 9 || key == 13 || key == 46 || key == 45) {
                return true;
            }
            var v = this.value;
            if (key == 109 || key == 189) {
                if (v[0] === "-") {
                    return false;
                }
            }
            if (!e.shiftKey && !e.altKey && !e.ctrlKey && key == 190 || key == 188 || key == 110) {
                if (/[\.,]/.test(v)) {
                    return false;
                }
            }
        });
        textbox.addEventListener("keyup", function _OnNumericInputKeyUp(e) {
            var v = this.value;
            if (false) {} else if (v) {
                v = (v[0] === "-" ? "-" : "") + (useCommaAsDecimalSeparator ? v.replace(/[^0-9\,]/g, "") : v.replace(/[^0-9\.]/g, ""));
                if (useCommaAsDecimalSeparator) {
                    v = v.replace(/,(?=(.*),)+/g, "");
                } else {
                    v = v.replace(/\.(?=(.*)\.)+/g, "");
                }
                this.value = v;
            }
        });
    };
    TB.CONFIG.XERRORS_HOOK_ERROR_HANDLER_UI = function(tbError) {
        if (TB.isDefined(tbError) && TB.isObject(tbError) && TB.isDefined(tbError.tbData) && TB.isDefined(tbError.message)) {
            ASSERT_PEER(TB.isObject(tbError.tbData), {
                msg: "event.error.errData is not object"
            });
            ASSERT_PEER(TB.isString(tbError.tbData.type), {
                msg: "event.error.errData.type is not string"
            });
            ASSERT_PEER(TB.isString(tbError.message), {
                msg: "event.error.message is not string"
            });
            console.log("TB err data type ", tbError.tbData.type, tbError);
            var msg = "Something went wrong! Please try again later! (150)";
            if (tbError.tbData.type == TB.CONFIG.ERR_APP) {
                msg = "Something went wrong! Please try again later! (151)";
                TB.msg({
                    type: "error",
                    msg: msg
                });
                FLUSH("ERROR", msg);
            } else if (tbError.tbData.type == TB.CONFIG.ERR_PEER) {
                msg = "Something went wrong! Please try again later! (152)";
                TB.msg({
                    type: "error",
                    msg: msg
                });
                FLUSH("ERROR", msg);
            } else if (tbError.tbData.type == TB.CONFIG.ERR_USER) {
                TB.msg({
                    type: "error",
                    msg: tbError.message
                });
            } else if (tbError.tbData.type == TB.CONFIG.ERR_SYS) {
                FLUSH("ERROR", "SYS ERROR");
            } else {
                ASSERT_PEER(false, {
                    msg: "unknown type of error"
                });
            }
        }
        return false;
    };
    $(document).off("submit", ".p2p-form").on("submit", ".p2p-form", function(e) {
        e.preventDefault();
        $(this).find(".p2p-btn-primary").each(function() {
            if (!$(this).hasClass("disabled")) {
                $(this).trigger("click");
                return;
            }
        });
    });
    TB.guid = function() {
        return TB.s4() + TB.s4() + "-" + TB.s4() + "-" + TB.s4() + "-" + TB.s4() + "-" + TB.s4() + TB.s4() + TB.s4();
    };
    TB.s4 = function() {
        return Math.floor((1 + Math.random()) * 65536).toString(16).substring(1);
    };
    TB.getUrlParameter = function getUrlParameter(sParam) {
        var sPageURL = decodeURIComponent(window.location.search.substring(1)), sURLVariables = sPageURL.split("&"), sParameterName, i;
        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split("=");
            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : sParameterName[1];
            }
        }
    };
    TB.queryParamsToHash = function(queryParams) {
        console.log("Query Params To hash ", queryParams);
        ASSERT(TB.isObject(queryParams), {
            msg: "queryParams is not object"
        });
        var hash = $.map(Object.getOwnPropertyNames(queryParams), function(k) {
            if (Array.isArray(queryParams[k])) {
                var val = "";
                $.map(queryParams[k], function(e, i) {
                    val += k + "=" + e + ";";
                });
                return val;
            } else {
                return [ k, queryParams[k] ].join("=");
            }
        }).join(";");
        console.log("End QueryParams HAZ ", hash);
        return hash;
    };
    TB.toggleCheckbox = function(source, targetClassName, callback) {
        checkboxes = document.getElementsByClassName(targetClassName);
        for (var i = 0, n = checkboxes.length; i < n; i++) {
            checkboxes[i].checked = source.checked;
        }
        if (typeof callback != "undefined") {
            callback();
        }
    };
    TB.fillFields = function(source, targetClassName, callback) {
        fields = document.getElementsByClassName(targetClassName);
        var value = isNaN(source.value) ? "" : source.value;
        value = Number(value.replace(",", ".")).toFixed(2);
        value = isNaN(value) ? "0.00" : value;
        for (var i = 0, n = fields.length; i < n; i++) {
            fields[i].value = value;
        }
        if (typeof callback != "undefined") {
            callback();
        }
    };
})(jQuery);

TB.p2p_get_account_balances();

TB.p2p_get_statistics();

TB.sessionExpiredHook = function(params) {
    // localStorage.removeItem("session");
    // window.location.href = "login";
};

function p2p_get_req_url(handler) {
    ASSERT(typeof handler !== "undefined");
    ASSERT(typeof p2p_ui_url !== "undefined");
    ASSERT(typeof p2p_ui_url_cp !== "undefined");
    if (!TB.isDefined(TB.session_token)) {
        window.location.href = "/login";
        return false;
    }
    ASSERT(typeof TB.session_token !== "undefined");
    TB.ui_lang = TB.ui_lang || TB.getUrlParameter("lang") || "en_US";
    const baseUrl = java_pages.includes(handler) ? p2p_ui_url_cp : p2p_ui_url;
    var url = baseUrl + "?p0=" + handler + ";p2=" + TB.session_token + ";lang=" + TB.ui_lang;
    return url;
}

function p2p_load(session_token, page, lang) {
    console.log("Params ", session_token, page, lang, java_pages.includes(page));
    TB.ui_url = java_pages.includes(page) ? p2p_ui_url_cp : p2p_ui_url;
    TB.ui_lang = lang || TB.getUrlParameter("lang");
    hasher.setHash("p0=" + page + ";p2=" + session_token + ";lang=" + TB.ui_lang);
}
