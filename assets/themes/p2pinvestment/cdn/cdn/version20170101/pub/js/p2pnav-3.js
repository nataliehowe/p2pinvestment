TB.ui_lang = "en_US";

TB.setUILang();


$(document).ready(function() {
    var session = TB.p2p_get_session();
    console.log("Company menu ", session);
    if (typeof session !== "undefined") {
        $(".view-profile-company-menu").hide();
        var view_profile_url = $(".view-profile-individual-menu a").attr("href");
        console.log("Is Company ", session.is_company, session.is_company == 1);
        if (typeof session.is_company !== "undefined" && session.is_company == 1) {
            view_profile_url = $(".view-profile-company-menu a").attr("href");
        }
        console.log("Company href ", view_profile_url);
        $(".view-profile-individual-menu a").attr("href", view_profile_url);
    }
    if ($("#p2p_login_form").length) {
        $(".captcha").hide();
        var invalid_login_attempts = window.localStorage.getItem("invalid_login_attempts");
        if (typeof invalid_login_attempts === "undefined") {
            invalid_login_attempts = 0;
        } else {
            invalid_login_attempts = parseInt(invalid_login_attempts);
        }
        if (invalid_login_attempts >= 3) {
            $(".captcha").show();
        }
    }
    var params = TB.parseQueryParams("?" + window.location.href.split(/\?|#/, 2)[1]);
    console.log("Aff params ", params);
    if (typeof params !== "undefined" && typeof params.aff_code !== "undefined") {
        console.log("Set aff params ", params.aff_code);
        localStorage.setItem("p2pAffCode", params.aff_code.toLowerCase());
    }
    var p2pRegEmail = localStorage.getItem("p2pRegEmail");
    var p2pRegIdHash = localStorage.getItem("p2pRegIdHash");
    var p2pAffCode = localStorage.getItem("p2pAffCode");
    var lAff = document.createElement("a");
    lAff.href = window.document.href;
    var lAffRegex = RegExp("/thank-you/");
    if (typeof p2pAffCode !== "undefined" && lAffRegex.test(lAff.pathname)) {
        ASSERT(typeof p2pRegIdHash !== "undefined");
        var affRegexTS = RegExp("[0-9A-z]{8}-[0-9A-z]{4}-[0-9A-z]{4}-[0-9A-z]{4}-[0-9A-z]{12}");
        if (affRegexTS.test(p2pAffCode)) {
            console.log("TS Beacon");
            let beacon = '<img src="https://p.trackmytarget.com/?tmt_data=' + p2pAffCode + '&type=lead&event_sid=47kpam&id=' + p2pRegIdHash + '" alt="" border="0" width="0" height="0">';
            $("body").append(beacon);
        }
        localStorage.removeItem("p2pAffCode");
    }
    if (typeof p2pRegEmail !== "undefined") {
        var intrCount = 0;
        var p2pRegMailIntr = setInterval(function() {
            intrCount++;
            if (intrCount > 5) {
                clearInterval(p2pRegMailIntr);
            }
            if ($("#thank-you-page-email").length > 0) {
                $("#thank-you-page-email").html(p2pRegEmail);
                localStorage.removeItem("p2pRegEmail");
                localStorage.removeItem("p2pRegIdHash");
                clearInterval(p2pRegMailIntr);
            }
        }, 150);
    }
    var cartBoxContHtml = $("#cart-box-cont-selector").html();
    $("#cart-box-cont-selector").html("");
    $(".cart-box").html(cartBoxContHtml);
});

function cartRefresh(cart, params) {
    var itemsCountSelector = params.itemsCountSelector;
    var amountsSelector = params.amountsSelector;
    var amountKey = params.amountKey;
    var idKey = params.idKey;
    idKey = idKey || "id";
    $(itemsCountSelector).html(cart.length);
    var cartAmounts = {};
    for (var idx = 0; idx < cart.length; idx++) {
        if (typeof cartAmounts[cart[idx].currency_code] == "undefined") {
            cartAmounts[cart[idx].currency_code] = 0;
        }
        cartAmounts[cart[idx].currency_code] += Number(cart[idx][amountKey]);
    }
    console.log("Cart Amounts", cartAmounts);
    var ck_html_arr = [];
    for (var k in cartAmounts) {
        ck_html_arr.push(k + " " + cartAmounts[k].toFixed(2));
    }
    $(amountsSelector).html(ck_html_arr.join(", "));
    $(".p2p-cart-icon").hide();
    for (var idx = 0, len = cart.length; idx < len; idx++) {
        $("#p2p_cart_icon_" + cart[idx][idKey]).show();
    }
}

function getHashPageHandler() {
    var params = TB.parseQueryParams("?" + window.location.hash.substr(2));
    if (typeof params["p0"] !== "undefined") {
        return params["p0"];
    }
    return undefined;
}

function p2p_load_init_page(p2p_page) {
    var hash_handler = getHashPageHandler();
    console.log("p2p load init page lang ", TB.ui_lang, hash_handler);
    if (typeof hash_handler === "undefined") {
        p2p_load(TB.session_token, p2p_page, TB.ui_lang);
    }
}

function p2p_nav_page(cms_page, p2p_page) {
    var nav = window.location.pathname.split("/");
    if (nav.length >= 3) {
        if (nav[1] == cms_page || nav[2] == cms_page) {
            p2p_load(TB.session_token, p2p_page, TB.ui_lang);
            return true;
        } else {
            console.log("redirect to ", "/" + cms_page + "/#/p0=" + p2p_page + ";");
            window.location.href = "/" + cms_page + "/#/p0=" + p2p_page + ";";
            return false;
        }
    } else {
        console.log("redirect to 2 ", "/" + cms_page + "/#/p0=" + p2p_page + ";");
        window.location.href = "/" + cms_page + "/#/p0=" + p2p_page + ";";
        return false;
    }
}

function p2p_set_total_cart_count(cart_count) {
    $("#primary-market-cart-items-count").html(cart_count.primary_market_cart.count);
    $("#secondary-market-cart-items-count").html(cart_count.secondary_market_cart.count);
    $("#my-investments-cart-items-count").html(cart_count.my_investments_cart.count);
    var cart_count_total = cart_count.primary_market_cart.count + cart_count.secondary_market_cart.count + cart_count.my_investments_cart.count;
    console.log("Total Cart Count ", cart_count_total);
    if (cart_count_total > 99) {
        cart_count_total = "99+";
    }
    $("#cart-total-items-count").html(cart_count_total);
}

document.addEventListener("tbp2p_account_balances", function(e) {
    console.log("ACcount balancess ", e);
    var cart_count = undefined;
    if (typeof e.detail.tbp2p_cart_count != "undefined") {
        var interCartCount = 0;
        var interCart = setInterval(function() {
            if (typeof $("#primary-market-cart-items-count") != "undefined") {
                cart_count = e.detail.tbp2p_cart_count;
                p2p_set_total_cart_count(cart_count);
                var ck_html_arr = [];
                for (var ck in cart_count.primary_market_cart.amounts) {
                    ck_html_arr.push(ck + " " + cart_count.primary_market_cart.amounts[ck].toFixed(2));
                    console.log("Currency", ck, "amount", cart_count.primary_market_cart.amounts[ck]);
                }
                $("#primary-market-cart-amounts").html(ck_html_arr.join(", "));
                ck_html_arr = [];
                for (var ck in cart_count.secondary_market_cart.amounts) {
                    ck_html_arr.push(ck + " " + cart_count.secondary_market_cart.amounts[ck].toFixed(2));
                    console.log("Currency", ck, "amount", cart_count.secondary_market_cart.amounts[ck]);
                }
                $("#secondary-market-cart-amounts").html(ck_html_arr.join(", "));
                ck_html_arr = [];
                for (var ck in cart_count.my_investments_cart.amounts) {
                    ck_html_arr.push(ck + " " + cart_count.my_investments_cart.amounts[ck].toFixed(2));
                    console.log("Currency", ck, "amount", cart_count.my_investments_cart.amounts[ck]);
                }
                $("#my-investments-cart-amounts").html(ck_html_arr.join(", "));
                clearInterval(interCart);
            }
            interCart++;
            if (interCart > 10) {
                clearInterval(interCart);
            }
        }, 600);
    }
    var balances = e.detail.tbp2p_account_balances;
    console.log("Balances event ", balances);
    var sorted = [];
    for (var key in balances) {
        sorted[sorted.length] = key;
    }
    sorted.sort();
    var html = "";
    for (var i = 0; i < sorted.length; i++) {
        var value = balances[sorted[i]].amount_visible;
        var curr = balances[sorted[i]].currency_code;
        html += '<div id="balance_' + curr + '" class="stat"><span class="label">' + curr + ' </span><span class="value">' + value + "</span></div>";
    }
    var intrz = setInterval(function() {
        console.log("intrz");
        clearInterval(intrz);
    }, 700);
    var inter_balances = setInterval(function() {
        if ($("#balance").length > 0) {
            $("#balance").html(html);
            console.log("Balances html ", html);
            clearInterval(inter_balances);
        } else {
            console.log("Repeat account balance");
        }
    }, 700);
    var inter_notif = setInterval(function() {
        console.log("Inter Notif");
        if (typeof $("#user-menu .username") != "undefined") {
            if (typeof e.detail.tbp2p_session_info.investor_pid_verification_status_id !== "undefined" && typeof e.detail.tbp2p_session_info.investor_is_contact_verified !== "undefined") {
                console.log("Red Dot", e.detail);
                if (e.detail.tbp2p_session_info.investor_pid_verification_status_id != 4 || e.detail.tbp2p_session_info.investor_is_contact_verified != 1) {
                    $("#user-menu .username").addClass("notification");
                } else {
                    $("#user-menu .username").removeClass("notification");
                }
            }
            clearInterval(inter_notif);
        }
    }, 600);
}, false);

TB.p2p_get_account_balances();

$(document).ready(function(e) {
    $("#tbp2p_platform_activity_pub_page").on("click", function(e) {
        p2p_nav_page("market", "platform_activity_page");
    });
    $("#tbp2p_secondary_market_pub_page").on("click", function(e) {
        p2p_nav_page("market", "secondary_market_pub_page");
    });
    $("#tbp2p_primary_market_pub_page").on("click", function(e) {
        p2p_nav_page("market", "primary_market_pub_page");
    });
});

$(document).on("submit", "#p2p_reg_form", function(e) {
    e.preventDefault();
    var data = $(this).serialize();
    console.log("Register form submitted data ", data);
});

$(document).on("click", "#p2p_logout", function() {
    var redirectUrl = "/";
    if ($("#p2p_redirect_url_on_logout").length > 0 && $("#p2p_redirect_url_on_logout").data("url").length > 0) {
        redirectUrl = $("#p2p_redirect_url_on_logout").data("url");
    }
    TB.load({
        url: p2p_ui_url + "?" + "p0=logout&session_token=" + TB.session_token,
        method: "GET",
        alwaysCallback: function() {
            localStorage.removeItem("session");
            //remove cookie
            document.cookie = 'session_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            TB.session_token = undefined;
            window.location = redirectUrl;
        }
    });
});

$(document).on("submit", "#p2p_login_form", function(e) {
    e.preventDefault();
    var login = $("#p2p_login_form_login").val();
    var password = $("#p2p_login_form_password").val();
    // var grecaptcha_resp = grecaptcha.getResponse();
    var invalid_login_attempts = window.localStorage.getItem("invalid_login_attempts");
    if (typeof invalid_login_attempts === "undefined") {
        invalid_login_attempts = 0;
    } else {
        invalid_login_attempts = parseInt(invalid_login_attempts);
    }
    if ($("#p2p_login_form_login").hasClass("error") || $("#p2p_login_form_password").hasClass("error") || login.length <= 0 || password.length <= 0) {
        return;
    }
    var data = {
        email: login,
        password: password
    };
    console.log("\n\n\\" ,data)
    var randN = Math.random();
    // var req_str = "?p0=login;=" + TB.ui_lang + ";randn=" + randN;
    if (invalid_login_attempts >= 3) {
        // if (grecaptcha_resp.length <= 0) {
        //     return;
        // }
        // data["grecaptcha_resp"] = grecaptcha_resp;
        // req_str = req_str + ";grecaptcha_resp=" + encodeURIComponent(grecaptcha_resp);
    }
    fetch('http://localhost/p2pinvestment/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        data = data;
        var result = data
        console.log('Result status ',  data);
        // console.log(window.location.href, window.location.href.split('?')[0] + '?' + result);
        // if (typeof result === 'error' || typeof result.session_token === 'undefined') {
        //     localStorage.setItem('invalid_login_attempts', invalid_login_attempts + 1);
        //     if (invalid_login_attempts + 1 >= 3) {
        //         $('.captcha').show();
        //     }
        //     if (typeof data.status.msg !== 'undefined') {
        //         $('#p2p_login_form_err').html(data.status.msg);
        //         if (data.status.code === 'FO303') {
        //             $('.captcha').show();
        //             localStorage.setItem('invalid_login_attempts', 4);
        //         }
        //     } else {
        //         $('#p2p_login_form_err').html('Application error, please try again.');
        //     }
        // } else {
            var session_token = data.result.session_token;
            TB.session_token = data.result.session_token;
            TB.investor_id = data.result.investor_id;
            TB.investor_is_company = data.result.is_company;
            localStorage.setItem('session', JSON.stringify(data.result));
    
            document.cookie = 'session_token=' + TB.session_token + '; expires=2147483647; path=/';
    
            localStorage.setItem('invalid_login_attempts', 0);
            TRACE('Session token: ', TB.session_token);
            console.log('Success login ', TB.session_token);
            console.log('Trigger event on_p2p_login_form_ok');
            var event = TB.createNewEvent('on_p2p_login_form_ok');
            document.dispatchEvent(event);
            var redirectUrl = 'pifi-dashboard/';
            if ($('#p2p_redirect_url_on_login').length > 0 && $('#p2p_redirect_url_on_login').data('url').length > 0) {
                redirectUrl = $('#p2p_redirect_url_on_login').data('url') + '/';
            }
            window.location.href = redirectUrl;
        // }
    })
    .catch(error => {
        $('#p2p_login_form_err').html(error.message);
        localStorage.setItem('invalid_login_attempts', invalid_login_attempts + 1);
        if (invalid_login_attempts + 1 >= 3) {
            $('.captcha').show();
        }
    });
    
});

$(document).ready(function() {
    $(".showpassword").click(function() {
        console.log("test4e show passw");
        var selectedInput = $(this).parent().children("input");
        var culture = $("html").attr("lang");
        var msgs = {
            "bg-BG": {
                show: "Покажи паролата",
                hide: "Скрий паролата"
            },
            "en-US": {
                show: "Show password",
                hide: "Hide password"
            },
            "et-EE": {
                show: "Näita salasõna",
                hide: "Peida parool"
            },
            "de-DE": {
                show: "Show password",
                hide: "Hide password"
            },
            "es-ES": {
                show: "Mostrar contraseña",
                hide: "Ocultar contraseña"
            }
        };
        if ($(this).html() == msgs[culture]["show"] + ' <span class="glyphicon glyphicon-eye-close"></span>') {
            $(this).html(msgs[culture]["hide"] + ' <span class="glyphicon glyphicon-eye-open"></span>');
            selectedInput.attr("type", "text");
        } else {
            $(this).html(msgs[culture]["show"] + ' <span class="glyphicon glyphicon-eye-close"></span>');
            selectedInput.attr("type", "password");
        }
    });
});

(function($) {
    $(document).ready(function() {
        function getValue(key) {
            return decodeURIComponent(/^([^\/]+)/.exec(location.href.split(key + "=")[1])[0]);
        }
        var reset_key = getValue("reset_key");
        $("#sendNewPassBtn").on("click", function(e) {
            e.preventDefault();
            var data = {
                reset_key: reset_key,
                password: $("#newPass").val(),
                re_password: $("#repeatNewPass").val(),
                // grecaptcha_resp: grecaptcha.getResponse()
            };
            console.log("reset pass data ", data);
            if ($("#newPass").valid() && $("#repeatNewPass").valid()) {
                grecaptcha.reset();
                TB.load({
                    url: p2p_ui_url + "?p0=password_reset;lang=en_US",
                    method: "POST",
                    data: data,
                    successCallback: function(data) {
                        $(".custom-msg").remove();
                        console.log("Req data ", data);
                        if (data.data.status.status == "ok") {
                            $("#sendNewPassBtn").after('<div class="success-msg custom-msg"><p>PASSWORD CHANGED SUCCESSFULLY.<p></div>');
                            setTimeout(function() {
                                window.location.href = "/login";
                            }, 2e3);
                        } else {
                            var msg = "Expired link.";
                            if (typeof data.data.status.msg !== "undefined") {
                                msg = data.data.status.msg;
                            }
                            $("#sendNewPassBtn").after('<div class="invalid-msg custom-msg">' + msg + "</div>");
                        }
                    },
                    alwaysCallback: function() {},
                    errorCallback: function(data) {
                        $(".custom-msg").remove();
                        $("#sendNewPassBtn").after('<div class="invalid-msg custom-msg">Error, Please try again.</div>');
                    }
                });
            }
        });
    });
})(jQuery);

function findPaymentSystem(currencyCode, paySysType, settings, type) {
    ASSERT(typeof currencyCode !== "undefined");
    ASSERT(typeof paySysType !== "undefined");
    ASSERT(typeof settings !== "undefined");
    ASSERT(typeof type !== "undefined");
    for (var i = 0; i < settings.length; i++) {
        if (type == "deposit" && !settings[i].is_deposit_allowed || type == "withdraw" && !settings[i].is_cashout_allowed) {
            continue;
        }
        if (settings[i].pay_type == paySysType && settings[i].currency_code == currencyCode) {
            return settings[i];
        }
    }
    return undefined;
}

function fillDepositFeeFields(currPaySys, depositAmount) {
    if (typeof currPaySys === "undefined") {
        FLUSH("ERROR", "Unsupported payment method.");
        $("#errorModal").find(".modal-body").text("Unsupported payment method");
        $("#errorModal").modal("show");
        return false;
    }
    if (TB.isNumeric(depositAmount)) {
        var feePct = currPaySys.deposit_fee_pct;
        depositAmount = depositAmount >= 0 ? depositAmount : 0;
        ASSERT(typeof feePct !== "undefined");
        var feeAmountFixed = Number(currPaySys.deposit_fee_money);
        var feeAmount = depositAmount * (feePct / 100) + feeAmountFixed;
        var totalAmount = Number(depositAmount) + Number(feeAmount);
        console.log("Curr pay sysz", currPaySys, depositAmount, feeAmount, feePct, totalAmount);
        var regex = new RegExp(/^\d*\.?\d{0,2}$/);
        if (Number(totalAmount) < Number(currPaySys.deposit_min_amount) || Number(totalAmount) > Number(currPaySys.deposit_max_amount) || !TB.isNumeric(totalAmount) || !regex.test(depositAmount)) {
            $(".tr_min_am").html(currPaySys.deposit_min_amount + "&nbsp;" + TB.pay_sys.currency_code);
            $(".tr_max_am").html(currPaySys.deposit_max_amount + "&nbsp;" + TB.pay_sys.currency_code);
            $(".secondary_msg").parent().show();
            $(".amount_input").addClass("error");
            $(".continue_link_btn").addClass("disabled");
        } else {
            $(".secondary_msg").parent().hide();
            $(".amount_input").removeClass("error");
            $(".continue_link_btn").removeClass("disabled");
        }
        feePct = Number(feePct).toFixed(2);
        feeAmount = Number(feeAmount).toFixed(2);
        totalAmount = Number(totalAmount).toFixed(2);
        feeAmountFixed = Number(feeAmountFixed).toFixed(2);
        $(".trans_fee_perc").text(feePct);
        $(".trans_fee_fixed").text(feeAmountFixed);
        $(".trans_fee_amount").text(feeAmount);
        $(".trans_fee_total_amount").text(totalAmount);
    }
}

function fillWithdrawFeeFields(currPaySys, withdrawAmount) {
    withdrawAmount = withdrawAmount >= 0 ? withdrawAmount : 0;
    if (typeof currPaySys === "undefined") {
        FLUSH("ERROR", "Unsupported payment method.");
        $("#errorModal").find(".modal-body").text("Unsupported payment method");
        $("#errorModal").modal("show");
        $(".continue_form_btn").addClass("disabled");
        return false;
    }
    if (TB.isNumeric(withdrawAmount)) {
        var feePct = currPaySys.cashout_fee_perc;
        ASSERT(typeof feePct !== "undefined");
        var feeAmountFixed = Number(currPaySys.cashout_fee_amount);
        var feeAmount = withdrawAmount - currPaySys.cashout_fee_amount - (withdrawAmount - currPaySys.cashout_fee_amount) / (1 + currPaySys.cashout_fee_perc / 100) + feeAmountFixed;
        var totalAmount = Number(withdrawAmount) - Number(feeAmount);
        feePct = Number(feePct).toFixed(2);
        feeAmountFixed = Number(feeAmountFixed).toFixed(2);
        feeAmount = Number(feeAmount).toFixed(2);
        totalAmount = Number(totalAmount).toFixed(2);
        $(".trans_fee_perc").text(feePct);
        $(".trans_fee_fixed").text(feeAmountFixed);
        $(".trans_fee_amount").text(feeAmount);
        $(".trans_fee_total_amount").text(totalAmount);
    }
}

function p2pDepositPageReady() {
    console.log("Deposit Page Ready func");
    session = TB.p2p_get_session();
    if (!TB.isDefined(TB.session_token)) {
        window.location.href = "/login";
        return false;
    }
    ASSERT(typeof session !== "undefined");
    var pay_sys_settings = session.pay_sys_settings;
    var url = p2p_get_req_url("get_personal_info");
    TB.load({
        url: url,
        method: "GET",
        successCallback: function(data) {
            console.log("Get Personal info Data ", data);
            if (typeof data.data !== "undefined" && typeof data.data.result !== "undefined" && typeof data.data.result.personal_data !== "undefined") {
                var personal_data = data.data.result.personal_data;
                var has_no_national_id = "false";
                console.log("Personal dataa", personal_data, personal_data.birth_date, personal_data.personal_number);
                $("#popup_birthDay").val(personal_data.birth_date).trigger("input");
                $("#popup_national_id").val(personal_data.personal_number).trigger("input");
                var show_popup = false;
                if (typeof personal_data.has_no_national_id !== "undefined" && personal_data.has_no_national_id != null) {
                    has_no_national_id = personal_data.has_no_national_id;
                }
                if (typeof personal_data.birth_date !== "undefined" && personal_data.birth_date != null && personal_data.birth_date.length > 0) {
                    $("#popup_birthDay").hide();
                    $('[for="birthDay"]').hide();
                } else {
                    show_popup = true;
                }
                if (typeof personal_data.personal_number !== "undefined" && personal_data.personal_number != null && personal_data.personal_number.length > 0 || has_no_national_id == "true") {
                    $("#popup_national_id").hide();
                    $('[for="national_id"]').hide();
                    $(".checkbox_wrap").hide();
                } else {
                    show_popup = true;
                }
                if (show_popup) {
                    $("#national_id_popup").show();
                } else {
                    $("#national_id_popup").hide();
                }
            }
        }
    });
    TB.pay_sys = {};
    $(".continue_link_btn, .currency_select_btn").click(function(e) {
        var pay_type = $("input[name='pay_type']").val();
        if (typeof pay_type !== "undefined" && pay_type.length > 0 && pay_type != null && pay_type != "null") {
            TB.pay_sys.type = pay_type.toUpperCase();
        }
    });
    $(".currency_select_btn").click(function(e) {
        var currency_code = $("input[name='currency_code']").val();
        if (typeof currency_code !== "undefined" && currency_code.length > 0 && currency_code != null && currency_code != "null") {
            TB.pay_sys.currency_code = currency_code;
            var currency_code_lc = TB.pay_sys.currency_code.toLowerCase();
            $(".trans_fee_perc").text("");
            $(".trans_fee_fixed").text("");
            $(".trans_fee_amount").text("");
            $(".trans_fee_total_amount").text("");
        }
        if (typeof TB.pay_sys.type !== "undefined" && typeof TB.pay_sys.currency_code !== "undefined" && TB.pay_sys.type !== "BANK TRANSFER") {
            var currPaySys = findPaymentSystem(TB.pay_sys.currency_code, TB.pay_sys.type, pay_sys_settings, "deposit");
            fillDepositFeeFields(currPaySys, 0);
        }
    });
    $(".amount_input").on("keyup", function(e) {
        console.log("TB Pay SyS ", TB.pay_sys.type, TB.pay_sys.currency_code);
        if (typeof TB.pay_sys.type !== "undefined" && typeof TB.pay_sys.currency_code !== "undefined" && TB.pay_sys.type !== "BANK TRANSFER") {
            var currPaySys = findPaymentSystem(TB.pay_sys.currency_code, TB.pay_sys.type, pay_sys_settings, "deposit");
            console.log("Curr Pay Sys Settingz ", currPaySys);
            var depositAmount = $(this).val();
            fillDepositFeeFields(currPaySys, depositAmount);
        }
    });
    $(".nat_id_form .blue_round_btn").click(function(e) {
        e.preventDefault();
        var url = p2p_get_req_url("update_personal_info");
        var birth_date = $("#popup_birthDay").val();
        var national_id = $("#popup_national_id").val();
        var has_no_national_id = $("#no_national_id").prop("checked");
        var has_error = false;
        if (typeof birth_date === "undefined" || birth_date.length <= 0) {
            $("#errorModal .modal-header .modal-title").html("");
            $("#errorModal .modal-body").html("Birth date is required!");
            $("#errorModal").modal("show");
            $("#national_id_popup").addClass("active_pop");
            has_error = true;
        }
        if (!has_error) {
            TB.load({
                url: url,
                method: "POST",
                data: {
                    birth_date: birth_date,
                    personal_number: national_id,
                    has_no_national_id: has_no_national_id
                },
                successCallback: function(data) {
                    console.log("Update Personal info ", data);
                    data = data.data;
                    if (typeof data.status != "undefined" && data.status.status == "ok") {} else if (typeof data.status === "object" && typeof data.status.status === "string" && data.status.status !== "ok") {
                        var msg = data.status.msg;
                        $("#errorModal .modal-header .modal-title").html("");
                        $("#errorModal .modal-body").html(msg);
                        $("#errorModal").modal("show");
                        $("#national_id_popup").addClass("active_pop");
                    } else {
                        $("#national_id_popup").addClass("active_pop");
                        alert("fail");
                    }
                }
            });
        }
    });
    $(".continue_form_btn").click(function(e) {
        e.preventDefault();
        if (typeof TB.pay_sys.type !== "undefined" && typeof TB.pay_sys.currency_code !== "undefined") {
            var currency_code_lc = TB.pay_sys.currency_code.toLowerCase();
            var currPaySys = findPaymentSystem(TB.pay_sys.currency_code, TB.pay_sys.type, pay_sys_settings, "deposit");
            var depositAmount;
            if (TB.pay_sys.type == "CARDS") {
                depositAmount = $("#amount_card_transfer_" + currency_code_lc).val();
            } else if (TB.pay_sys.type == "TRUSTLY") {
                depositAmount = $("#amount_trustly_transfer_" + currency_code_lc).val();
            }
            if (typeof depositAmount === "undefined" || depositAmount <= 0) {
                $("#errorModal").find(".modal-body").text("Deposit amount is required!");
                $("#errorModal").modal("show");
                return false;
            }
            var url = p2p_get_req_url("deposit_apco_page");
            url = url + ";deposit_amount=" + depositAmount + ";pay_type=" + TB.pay_sys.type + ";currency_code=" + TB.pay_sys.currency_code + ";payment_system_id=" + currPaySys.pay_sys_id;
            $("#content").prepend('<img src="' + TB_CONFIG.p2p_cdn_url + 'img/rolling.svg" id="p2p_loading_indicator" style="position: fixed; top: 50%; left: 50%; z-index: 999999;">');
            var ifrm = document.createElement("iframe");
            ifrm.setAttribute("src", url);
            ifrm.setAttribute("id", "apco_ifrm");
            ifrm.style.width = "800px";
            ifrm.style.height = "500px";
            var ifrmLoadedURL = "https://www.apsp.biz/pay/FP5A/checkout.aspx";
            ifrm.onload = function() {
                $("#p2p_loading_indicator").hide();
                $(".iframe_info").html("");
                $("#successModal").modal("hide");
            };
            $(".iframe_address").text(ifrmLoadedURL);
            if (TB.pay_sys.type == "CARDS") {
                $("#apco_iframe").html("");
                $("#apco_iframe").append(ifrm);
            } else if (TB.pay_sys.type == "TRUSTLY") {
                $("#trustly_iframe").html("");
                $("#trustly_iframe").append(ifrm);
            }
        }
    });
}

function p2pWithdrawPageReady() {
    console.log("Withdraw Page Ready func");
    session = TB.p2p_get_session();
    if (!TB.isDefined(TB.session_token)) {
        window.location.href = "/login";
        return false;
    }
    ASSERT(typeof session !== "undefined");
    var pay_sys_settings = session.pay_sys_settings;
    document.withdrawDataObj;
    TB.pay_sys = {};
    $(".card_pay").hide();
    var url = p2p_get_req_url("get_withdraw_data");
    TB.load({
        url: url,
        method: "GET",
        successCallback: function(data) {
            console.log("Get Withdraw Data ", data);
            if (typeof data.data !== "undefined" && typeof data.data.result !== "undefined" && typeof data.data.result.withdraw_data !== "undefined") {
                withdrawData = data.data.result.withdraw_data;
                document.withdrawDataObj = {};
                console.log("Withdraw dataz ", withdrawData);
                var has_cards_deposit = false;
                $(".currency_list li").hide();
                for (var i = 0; i < withdrawData.length; i++) {
                    var currencyCodeLc = withdrawData[i].currency_code.toLowerCase();
                    var availWithdrawAmount = withdrawData[i].avail_withdraw_amount;
                    var investorBankAccHtml = "";
                    if (withdrawData[i].has_cards_deposit == true) {
                        has_cards_deposit = true;
                    }
                    document.withdrawDataObj[withdrawData[i].currency_code] = withdrawData[i];
                    $("#bank_av_wt_amount_" + currencyCodeLc).parent().show();
                    $("#card_av_wt_amount_" + currencyCodeLc).parent().show();
                    $("#bank_av_wt_amount_" + currencyCodeLc + " span").html(availWithdrawAmount);
                    $("#card_av_wt_amount_" + currencyCodeLc + " span").html(availWithdrawAmount);
                    for (var k = 0; k < withdrawData[i].banks.length; k++) {
                        investorBankAccHtml += "<option data-bank_name='" + withdrawData[i].banks[k].investor_bank_name + "' data-bank_iban='" + withdrawData[i].banks[k].investor_bank_iban + "' data-bank_bic='" + withdrawData[i].banks[k].investor_bank_bic + "'>" + withdrawData[i].banks[k].investor_bank_name + " (" + withdrawData[i].banks[k].investor_bank_iban + ")</option>";
                    }
                    $("#bank_wt_account_" + currencyCodeLc).append(investorBankAccHtml);
                    console.log("Invevsto bank Acc html ", investorBankAccHtml);
                }
                if (has_cards_deposit) {
                    $(".card_pay").show();
                }
                var event = TB.createNewEvent("on_p2p_bank_accounts_select_ready");
                document.dispatchEvent(event);
            }
        }
    });
    function setPayType() {
        var pay_type = $("input[name='pay_type']").val();
        if (typeof pay_type !== "undefined" && pay_type.length > 0 && pay_type != null && pay_type != "null") {
            if (pay_type == "Btrans") {
                TB.pay_sys.type = "BANK TRANSFER";
            } else if (pay_type == "Ctrans") {
                TB.pay_sys.type = "CARDS";
            }
        }
    }
    $(".continue_link_btn").click(function(e) {
        setPayType();
    });
    $(".currency_select_btn").click(function(e) {
        var currency_code = $("input[name='currency_code']").val();
        if (typeof currency_code !== "undefined" && currency_code.length > 0 && currency_code != null && currency_code != "null") {
            TB.pay_sys.currency_code = currency_code;
            var currency_code_lc = TB.pay_sys.currency_code.toLowerCase();
            $(".trans_fee_perc").text("");
            $(".trans_fee_fixed").text("");
            $(".trans_fee_amount").text("");
            $(".trans_fee_total_amount").text("");
        }
        if (typeof TB.pay_sys.type !== "undefined" && typeof TB.pay_sys.currency_code !== "undefined" && TB.pay_sys.type !== "BANK TRANSFER") {
            var currPaySys = findPaymentSystem(TB.pay_sys.currency_code, TB.pay_sys.type, pay_sys_settings, "withdraw");
            fillWithdrawFeeFields(currPaySys, 0);
        }
    });
    $(".confirm_withdraw_btn").click(function(e) {
        e.preventDefault();
        if ($(this).hasClass("disabled")) {
            return;
        }
        setPayType();
        $(this).addClass("disabled");
        ASSERT(typeof TB.pay_sys.type !== "undefined");
        ASSERT(typeof TB.pay_sys.currency_code !== "undefined");
        var currency_code_lc = TB.pay_sys.currency_code.toLowerCase();
        var withdraw_amount;
        var bank_obj = $("#bank_wt_account_" + currency_code_lc).find(":selected");
        var bank_name;
        var bank_iban;
        var bank_bic;
        var pay_sys_id;
        var withdraw_amount_elem;
        if (TB.pay_sys.type == "BANK TRANSFER") {
            bank_name = bank_obj.data("bank_name");
            bank_iban = bank_obj.data("bank_iban");
            bank_bic = bank_obj.data("bank_bic");
            withdraw_amount = $("#amount_bank_withdraw_" + currency_code_lc).val();
            withdraw_amount_elem = $("#bank_av_wt_amount_" + currency_code_lc + " span");
        } else if (TB.pay_sys.type == "CARDS") {
            var currPaySys = findPaymentSystem(TB.pay_sys.currency_code, TB.pay_sys.type, pay_sys_settings, "withdraw");
            withdraw_amount = $("#amount_card_withdraw_" + currency_code_lc).val();
            withdraw_amount_elem = $("#card_av_wt_amount_" + currency_code_lc + " span");
            console.log("Currenct Withdraw Pay SYS ", currPaySys, currPaySys.pay_sys_id);
            console.log("Clicked withddrrr ", bank_name, bank_iban, bank_bic);
            if (typeof currPaySys !== "undefined") {
                pay_sys_id = currPaySys.pay_sys_id;
            } else {
                $("#errorModal").find(".modal-body").text("Unsupported payment method");
                $("#errorModal").modal("show");
            }
        }
        var url = p2p_get_req_url("withdraw_new");
        var investor_id = TB.p2p_get_session().investor_id;
        $.ajax({
            url: p2p_ui_url_cp + "getInvestorWithdrawLimits",
            data: {withdraw_amount: withdraw_amount,
                   currency: TB.pay_sys.currency_code,
                   investorId: investor_id},
            success: function(data) {
                console.log("DATA: " + data);
                TB.loadUI({
                    url: url,
                    method: "POST",
                    data: {
                        withdraw_amount: withdraw_amount,
                        pay_sys_type: TB.pay_sys.type,
                        investor_bank_name: bank_name,
                        investor_bank_iban: bank_iban,
                        investor_bank_bic: bank_bic,
                        currency_code: TB.pay_sys.currency_code,
                        pay_sys_id: pay_sys_id,
                        fee_amount: data
                    },
                    successCallback: function(params) {
                        console.log("Get Withdraw NEW Data ", params);
                        var contentType = params.xhr.getResponseHeader("content-type");
                        ASSERT(/^application\/json/.test(contentType), {
                            msg: "contentType is not json"
                        });
                        if (typeof params.data.status === "object" && typeof params.data.status.status === "string" && params.data.status.status === "ok") {
                            var msg = params.data.result.msg;
                            $("#successModal .modal-header .successModal-success-message-text").html("");
                            $("#successModal .modal-body .successModal-success-message-text").html(msg);
                            $("#successModal").modal("show");
                            $(".amount_input").val(0);
                            $(".confirm_withdraw_btn").addClass("disabled");
                            $(".trans_fee_amount").text(0);
                            $(".trans_fee_total_amount").text(0);
                            var withdraw_avail_amount = Number(withdraw_amount_elem.text()) - Number(withdraw_amount);
                            if (TB.isNumeric(Number(withdraw_avail_amount))) {
                                withdraw_amount_elem.text(withdraw_avail_amount.toFixed(2));
                            }
                        } else if (typeof params.data.status === "object" && typeof params.data.status.status === "string" && params.data.status.status !== "ok") {
                            var msg = params.data.status.msg;
                            $("#errorModal .modal-header .modal-title").html("");
                            $("#errorModal .modal-body").html(msg);
                            $("#errorModal").modal("show");
                        }
                    }
                });
            },
            errorCallback: function (data) {
                console.log("ERROR: " + data);
            }
            });
    });

    $(".amount_input").on("keyup", function(e) {
        console.log("TB Pay SyS ", TB.pay_sys.type, TB.pay_sys.currency_code);
        var withdrawAmount = $(this).val();
        var currency_code_lc = TB.pay_sys.currency_code.toLowerCase();
        var investor_bank = $("#bank_wt_account_" + currency_code_lc).find(":selected").val();
        var has_amount_err = false;
        if (Number(withdrawAmount) > Number(document.withdrawDataObj[TB.pay_sys.currency_code].avail_withdraw_amount) || Number(withdrawAmount) < 10 || !TB.isNumeric(withdrawAmount)) {
            has_amount_err = true;
        }
        console.log("TB Pay SyS ", has_amount_err);
        if (has_amount_err || typeof investor_bank === "undefined") {
            $(".confirm_withdraw_btn").addClass("disabled");
            console.log("TB Pay SyS ", "Number(withdrawAmount)", Number(withdrawAmount), "Number(document.withdrawDataObj[TB.pay_sys.currency_code].avail_withdraw_amount", Number(document.withdrawDataObj[TB.pay_sys.currency_code].avail_withdraw_amount));
            if (has_amount_err) {
                // $(".secondary_msg").parent().show();
                $('.msg_wrap').show();
                $(this).addClass("error");
                if (Number(withdrawAmount) > Number(document.withdrawDataObj[TB.pay_sys.currency_code].avail_withdraw_amount)) {
                    // $(".secondary_msg").parent().hide();
                    // $(".primary_msg").parent().show();
                    $(".secondary_msg").hide();
                    $(".primary_msg").show();

                    console.log("TB Pay SyS primary_msg show");
                } else {
                    // $(".primary_msg").parent().hide();
                    // $(".secondary_msg").parent().show();
                    $(".primary_msg").hide();
                    $(".secondary_msg").show();

                    console.log("TB Pay SyS secondary_msg show");
                }
            }
        } else {
            console.log("TB Pay SyS hide");
            $(this).removeClass("error");
            $(".primary_msg").parent().hide();
            $(".secondary_msg").parent().hide();
            $(".confirm_withdraw_btn").removeClass("disabled");
        }
        if (typeof TB.pay_sys.type !== "undefined" && typeof TB.pay_sys.currency_code !== "undefined" && TB.pay_sys.type !== "BANK TRANSFER") {
            var currPaySys = findPaymentSystem(TB.pay_sys.currency_code, TB.pay_sys.type, pay_sys_settings, "withdraw");
            ASSERT(typeof document.withdrawDataObj[TB.pay_sys.currency_code] !== "undefined");
            fillWithdrawFeeFields(currPaySys, $(this).val());
        }
    });
}

(function($, document) {
    $(document).ready(function() {
        var currentPageCulture = "en-US";
        if (TB.ui_lang == "bg_BG") {
            currentPageCulture = "bg-BG";
        } else if (TB.ui_lang == "et_EE") {
            currentPageCulture = "et-EE";
        } else if (TB.ui_lang == "es_ES") {
            currentPageCulture = "es-ES";
        } else if (TB.ui_lang == "de_DE") {
            currentPageCulture = "de-DE";
        }
        $("#resetPassBtn").on("click", function(ev) {
            var email = $("#resetPassEmail").val();
            ev.preventDefault();
            if (!email) {
                return;
            }
            TB.load({
                url: p2p_ui_url + "?p0=password_reset;lang=" + TB.getUrlParameter("lang"),
                method: "POST",
                data: {
                    email: email,
                    // grecaptcha_resp: grecaptcha.getResponse()
                },
                successCallback: function(data) {
                    console.log("Data ", data);
                    if (data.data.status.status == "ok") {
                        var msgs = {
                            "bg-BG": "Моля проверете Вашият мейл.",
                            "en-US": "Please check your email.",
                            "et-EE": "Kontrollige oma e-posti.",
                            "es-ES": "Por favor revise su correo electrónico.",
                            "de-DE": "Please check your email."
                        };
                        $(".custom-msg").remove();
                        var msg = $('<div class="success-msg custom-msg"></div>');
                        var p = $("<p></p>");
                        p.text(msgs[currentPageCulture]);
                        p.appendTo(msg);
                        $("#resetPassBtn").after(msg);
                    } else {
                        $(".custom-msg").remove();
                        $("#resetPassBtn").after('<div class="invalid-msg custom-msg">' + data.data.status.msg + "</div>");
                    }
                },
                alwaysCallback: function() {},
                errorCallback: function(data) {
                    $(".reg-error-msg").remove();
                    $("#p2p_reg_form_register_btn").after('<div class="reg-error-msg invalid-msg">' + data.msg + "</div>");
                    grecaptcha.reset();
                }
            });
        });
        var validator = window.validator = function() {
            console.log("Current culture", currentPageCulture);
            var errMsgs = {
                "en-US": {
                    required: "This field is required.",
                    email: "Please enter a valid e-mail address.",
                    passwordFormat: "The password must be at least 7 characters long and contain at least one upper case letter, one lower case letter, one number and one symbol (@#$%).",
                    passwordEqualTo: "The password does not match.",
                    lettersLatin: "Only characters A-Z are allowed.",
                    lettersLatinOrNumbers: "Only characters A-Z and numbers 0-9 are allowed. ",
                    allLatinCharacters: "Only latin characters, numbers and the following special symbols ,._@ *?! are allowed",
                    legalAge: "You must be at least 18 years of age.",
                    userAlreadyRegistered: "User: {0} is already registered.",
                    allLatinCharactersSpec: "Only latin characters, numbers and the following special symbols ,-._@ *?! are allowed",
                    allDigits: "Only digits are allowed",
                    passwordFormatNew: "The password must be at least 8 characters long and contain letters and numbers."
                },
                "bg-BG": {
                    required: "Това поле е задължително.",
                    email: "Моля въведете валиден имейл адрес.",
                    passwordFormat: "Паролата трябва да е поне 7 символа и да съдържа поне една главна буква, една малка буква, една цифра и един специален символ (@#$%).",
                    passwordEqualTo: "Паролата не съвпада с горната.",
                    lettersLatin: "Разрешени са само букви от A до Z.",
                    lettersLatinOrNumbers: "Разрешени са само букви от A до Z и цифри от 0 до 9.",
                    allLatinCharacters: "Разрешени са само латински букви, цифри и следните специални символи ,._@ *?!",
                    legalAge: "Трябва да сте пълнолетен",
                    userAlreadyRegistered: "Потребител: {0} вече е регистриран.",
                    allLatinCharactersSpec: "Разрешени са само латински букви, цифри и следните специални символи ,-._@ *?!",
                    allDigits: "Разрешени са само цифри",
                    passwordFormatNew: "Паролата трябва да е с дължина най-малко 8 знака и да съдържа букви и цифри."
                },
                "et-EE": {
                    required: "See väli on kohustuslik.",
                    email: "Palun sisestage kehtiv e-posti aadress.",
                    passwordFormat: "Salasõna peab koosnema vähemalt seitsmest tähemärgist ning sisaldama vähemalt üht suurtähte, üht väiketähte, üht numbrit ja üht sümbolit (@#$%).",
                    passwordEqualTo: "Salasõnad ei kattu.",
                    lettersLatin: "Lubatud on ainult tähed A–Z.",
                    lettersLatinOrNumbers: "Lubatud on ainult tähed A–Z ja numbrid 0–9. ",
                    allLatinCharacters: "Lubatud on ainult ladina tähed, numbrid ja erisümbolid ,._@ *?!",
                    legalAge: "Te peate olema vähemalt 18-aastane.",
                    userAlreadyRegistered: "Kasutaja: {0} on juba registreeritud.",
                    allLatinCharacters: "Lubatud on ainult ladina tähed, numbrid ja erisümbolid ,-._@ *?!",
                    allDigits: "Only digits are allowed",
                    passwordFormatNew: "Parool peab olema vähemalt 8 tähemärki pikk sisaldama tähte ja numbreid."
                },
                "es-ES": {
                    required: "Este campo es obligatorio.",
                    email: "Ingrese una dirección de correo electrónico válida.",
                    passwordFormat: "La contraseña debe tener al menos 7 caracteres y contener al menos una letra mayúscula, una letra minúscula, un número y un símbolo (@ # $%).",
                    passwordEqualTo: "La contraseña no coincide.",
                    lettersLatin: "Solo se permiten los caracteres A-Z.",
                    lettersLatinOrNumbers: "Solo se permiten los caracteres A-Z y los números 0-9.",
                    allLatinCharacters: "Solo se permiten caracteres latinos, números y los siguientes símbolos especiales, ._ @ * ?!",
                    legalAge: "Debe tener al menos 18 años de edad.",
                    userAlreadyRegistered: "Usuario: {0} ya está registrado.",
                    allLatinCharactersSpec: "Solo se permiten caracteres latinos, números y los siguientes símbolos especiales, -._ @ * ?!",
                    allDigits: "Solo se permiten dígitos.",
                    passwordFormatNew: "La contraseña debe tener al menos 8 caracteres y contener letras y números."
                },
                "de-DE": {
                    required: "Das ist ein Pflichtfeld.",
                    email: "Bitte, geben Sie eine gültige E - Mail Adresse an.",
                    passwordFormat: "Das Passwort muss mindestens 7 Zeichen lang sein und mindestens einen Großbuchstaben, einen Kleinbuchstaben, eine Ziffer und ein Symbol (@#$%) enthalten.",
                    passwordEqualTo: "Falsches Passwort.",
                    lettersLatin: "Nur Buchstaben von A bis Z sind zulässig.",
                    lettersLatinOrNumbers: "Nur Buchstaben von A bis Z und Ziffern von 0 bis 9 sind zulässig.",
                    allLatinCharacters: "Nur Buchstaben aus dem lateinische Alphabet, Ziffern und die folgenden Sonderzeichen , . _ @ * ? ! sind zulässig.",
                    legalAge: "Sie müssen mindestens 18 Jahre alt sein",
                    userAlreadyRegistered: "Bitte, geben Sie eine gültige E - Mail Adresse an.",
                    allLatinCharactersSpec: "Nur Buchstaben aus dem lateinische Alphabet, Ziffern und die folgenden Sonderzeichen , . _ @ * ? ! sind zulässig.",
                    allDigits: "Nur Ziffern sind zulässig.",
                    passwordFormatNew: "Das Passwort muss mindestens 8 Zeichen lang sein und sowohl Buchstaben als auch Ziffern enthalten"
                }
            };
            var rules = {};
            function _getErrMsg(errMsgType) {
                return errMsgs[currentPageCulture][errMsgType];
            }
            return {
                rules: rules,
                getErrMessage: _getErrMsg
            };
        }();
        var lettersLatinOnlyExp = /^[a-zA-Z ]+$/;
        var lettersLatinNumbersOnlyExp = /^[a-zA-Z0-9 ]+$/;
        var allLatinCharactersExp = /^[a-zA-Z0-9,._@*?! ]+$/m;
        var allLatinCharactersExpSpec = /^[a-zA-Z0-9\,\-._@*?! ]+$/m;
        var allDigitsExp = /^[0-9]+$/m;
        jQuery.validator.addMethod("allDigitsExp", function(value, element) {
            if (value) {
                return allDigitsExp.test(value);
            }
            return true;
        });
        jQuery.validator.addMethod("lettersLatinOnlyExp", function(value, element) {
            if (value) {
                return lettersLatinOnlyExp.test(value);
            }
            return true;
        });
        jQuery.validator.addMethod("lettersLatinNumbersOnlyExp", function(value, element) {
            if (value) {
                return lettersLatinNumbersOnlyExp.test(value);
            }
            return true;
        });
        jQuery.validator.addMethod("allLatinCharacters", function(value, element) {
            if (value) {
                return allLatinCharactersExp.test(value);
            }
            return true;
        });
        jQuery.validator.addMethod("allLatinCharactersSpec", function(value, element) {
            if (value) {
                return allLatinCharactersExpSpec.test(value);
            }
            return true;
        });
        jQuery.validator.addMethod("legalAge", function(value, element) {
            var selectedDate = $("#birthDate").val();
            var splitDateInfo = selectedDate.split("-");
            var day = splitDateInfo[2];
            var month = splitDateInfo[1];
            var year = splitDateInfo[0];
            var age = 18;
            console.log("LegalAge ", day, month, year);
            var insertedDate = new Date();
            insertedDate.setFullYear(year, month, day);
            insertedDate.setMonth(insertedDate.getMonth() - 1);
            var currentDate = new Date();
            currentDate.setFullYear(currentDate.getFullYear() - age);
            return currentDate >= insertedDate;
        }, validator.getErrMessage("legalAge"));
        jQuery.validator.addMethod("passwordEqualTo", function(value, element) {
            var regIndividual = $("#reg-individual");
            var newPass = $("#newPass");
            var pass = {
                val: function() {
                    console.log("Element not found.");
                    return undefined;
                }
            };
            if (regIndividual.length > 0) {
                pass = regIndividual.is(":checked") ? $("#individualPass") : $("#companyPass");
            } else if (newPass.length > 0) {
                pass = $("#newPass");
            }
            return value === pass.val();
        }, validator.getErrMessage("passwordEqualTo"));
        jQuery.validator.addMethod("iuvoEmail", function(value, element) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(value);
        }, validator.getErrMessage("email"));
        jQuery.validator.addMethod("passwordFormat", function(value, element) {
            return /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,}$/.test(value);
        }, validator.getErrMessage("passwordFormat"));
        jQuery.validator.addMethod("passwordFormatNew", function(value, element) {
            return /^.*(?=.{8,})(?=.*\d)(?=.*[a-zA-Z]).*$/.test(value);
        }, validator.getErrMessage("passwordFormatNew"));
        var sendBtns = $(".action-btn");
        sendBtns.click(function() {
            var areElementsValid = true;
            var selectorsToValid;
            var id = $(this).attr("id");
            if (id == "login-btn") selectorsToValid = "#loginContent input"; else if (id == "resetPassBtn") selectorsToValid = "#ResetPassContent input"; else selectorsToValid = ".modal-body input";
            $(selectorsToValid).each(function(index, element) {
                if (!$(element).valid()) {
                    if (areElementsValid) {
                        $(element).focus();
                    }
                    areElementsValid = false;
                }
            });
            if (areElementsValid) {
                var $this = $(this);
                $this.button("loading");
                setTimeout(function() {
                    if ($.active > 0) {
                        $(document).ajaxStop(function() {
                            $this.button("reset");
                        });
                    } else {
                        setTimeout(function() {
                            $this.button("reset");
                        }, 3e3);
                    }
                }, 500);
            }
        });
        function focusFirstError() {
            var elements = $("label[id*='error']");
            var firstError = undefined;
            for (var i = 0, count = elements.length; i < count; i += 1) {
                var el = elements.eq(i);
                if (el.css("display") != "none") {
                    firstError = el;
                    break;
                }
            }
            if (firstError && !!firstError.focus) {
                firstError.focus();
            }
        }
        var individual = $("#reg-individual");
        var company = $("#reg-company");
        var languageSelect = $("#individualPreferedLang");
        function _getIndividualUserData() {
            return {
                currentCountry: $("#individualCountry").children(":selected").val(),
                currentTown: $("#individualCity").val(),
                currentPostCode: $("#individualZipCode").val(),
                currentAddress: $("#individualAddress").val(),
                firstName: $("#individualName").val(),
                middleName: $("#individualSurname").val(),
                lastName: $("#individualLastName").val(),
                birthDate: $("#birthDate").val(),
                birthCountry: $("#birthPlace").children(":selected").val(),
                personalId: $("#personalId").val(),
                passportCountry: $("#individualTempContactCountry").children(":selected").val(),
                passportTown: $("#individualTempCity").val(),
                passportPostCode: $("#individualTempZipCode").val(),
                passportAddress: $("#individualTempAddress").val(),
                email: $("#individualEmail").val(),
                phone: $("#phone").val(),
                password: $("#individualPass").val(),
                acceptedTerms: $("#companyConfirmTerms").is(":checked"),
                preferredLanguage: $("#individualPreferedLang").children(":selected").val()
            };
        }
        function _getCompanyUserData() {
            return {
                companyCountry: $("#companyCountry").children(":selected").val(),
                companyTown: $("#companyCity").val(),
                companyAddress: $("#companyAddress").val(),
                companyName: $("#companyFirmName").val(),
                personalId: $("#companyEIK").val(),
                firstName: $("#companyNameMOL").val(),
                middleName: $("#companyMiddleNameMOL").val(),
                lastName: $("#companyLastNameMOL").val(),
                currentCountry: $("#companyTempContactCountry").children(":selected").val(),
                currentTown: $("#companyTempCity").val(),
                currentAddress: $("#companyCorrespondanceAddress").val(),
                currentPostCode: $("#companyPostCode").val(),
                phone: $("#companyPhone").val(),
                email: $("#companyMail").val(),
                activity: $("#companyActivity").val(),
                password: $("#companyPass").val(),
                acceptedTerms: $("#companyConfirmTerms").is(":checked"),
                preferredLanguage: $("#companyPreferedLang").children(":selected").val()
            };
        }
        TB._getNormalizedPhone = function(phone, phoneCode, phoneCodeVal) {
            console.log("getNormalizedPhone ", phone, phoneCode);
            if (typeof phone !== "undefined" && typeof phoneCode !== "undefined" && phoneCode.length > 0 && typeof phoneCodeVal !== "undefined" && phoneCodeVal.length > 0) {
                phoneCode = phoneCode.match(/\d+/)[0];
                console.log("Phone digit code ", phoneCode);
                var re = new RegExp("^(0+|\\+" + phoneCode + "|" + phoneCode + ")");
                phone = phone.replace(re, "");
                phone = phoneCode + phone;
            }
            console.log("Returned phone ", phone);
            return phone;
        };
        function _getIndividualUserDataNew() {
            return {
                firstName: $("#individualName").val(),
                lastName: $("#individualLastName").val(),
                currentCountry: $("#individualCountry").children(":selected").val(),
                phoneCountryCode: $("#phoneCountryCode").val().length > 0 ? $("#phoneCountryCode").val() : undefined,
                phone: TB._getNormalizedPhone($("#phone").val(), $("#phoneCountryCode option:selected").text(), $("#phoneCountryCode").val()),
                email: $("#individualEmail").val(),
                password: $("#individualPass").val(),
                acceptedTerms: $("#individualConfirmTerms").is(":checked"),
                acceptMarketingEmail: $("#individualAcceptMarketingEmail").is(":checked"),
                acceptMarketingSms: $("#individualAcceptMarketingSms").is(":checked"),
                acceptMarketingCall: $("#individualAcceptMarketingCall").is(":checked"),
                acceptMarketingOther: $("#individualAcceptMarketingOther").is(":checked"),
                isPeps: $("#pepsCheck").is(":checked")
            };
        }
        function _getCompanyUserDataNew() {
            return {
                companyName: $("#companyFirmName").val(),
                personalId: $("#companyEIK").val(),
                companyCountry: $("#companyCountry").children(":selected").val(),
                firstName: $("#companyNameMOL").val(),
                lastName: $("#companyLastNameMOL").val(),
                phoneCountryCode: $("#companyPhoneCountryCode").val().length > 0 ? $("#companyPhoneCountryCode").val() : undefined,
                phone: TB._getNormalizedPhone($("#companyPhone").val(), $("#companyPhoneCountryCode option:selected").text(), $("#companyPhoneCountryCode").val()),
                email: $("#companyMail").val(),
                password: $("#companyPass").val(),
                acceptedTerms: $("#companyConfirmTerms").is(":checked"),
                acceptMarketingEmail: $("#companyAcceptMarketingEmail").is(":checked"),
                acceptMarketingSms: $("#companyAcceptMarketingSms").is(":checked"),
                acceptMarketingCall: $("#companyAcceptMarketingCall").is(":checked"),
                acceptMarketingOther: $("#companyAcceptMarketingOther").is(":checked"),
                isPeps: $("#companyPepsCheck").is(":checked")
            };
        }
        $(".registration .get-started").click(function(ev) {
            ev.preventDefault();
            var regType = $('.registration input[name="reg-type"]:checked').val();
            if (regType == "Individual") {
                regSlider.goToSlide(1);
            } else if (regType == "Company") {
                regSlider.goToSlide(3);
            }
        });
        $(".registration .next").click(function(ev) {
            ev.preventDefault();
            $("#p2p_reg_form_new").validate();
            if ($("#p2p_reg_form_new").valid()) {
                regSlider.goToNextSlide();
            }
        });
        $(".p2p_reg_form_register_btn_new").on("click", function(ev) {
            ev.preventDefault();
            console.log("RegisterNew");
            var $this = $(this);
            var form = $("#p2p_reg_form_new");
            var userData, url;
            var isCompany = false;
            // var grecaptcha_str = window.grecaptcha_resp;
            if (individual.is(":checked")) {
                userData = _getIndividualUserDataNew();
            } else if (company.is(":checked")) {
                userData = _getCompanyUserDataNew();
                isCompany = true;
            }
            var regData = {
                password: userData.password,
                phone: userData.phone,
                phone_country_id: userData.phoneCountryCode,
                email: userData.email,
                personal_data: {
                    first_name: userData.firstName,
                    last_name: userData.lastName,
                    pid_country: userData.currentCountry
                },
                company_data: {},
                is_tc_confirmed: userData.acceptedTerms,
                accept_marketing_email: userData.acceptMarketingEmail,
                accept_marketing_sms: userData.acceptMarketingSms,
                accept_marketing_call: userData.acceptMarketingCall,
                accept_marketing_other: userData.acceptMarketingOther,
                is_not_political: userData.isPeps,
                is_email_verified: false,
                is_company: isCompany,
                // grecaptcha_resp: grecaptcha_str
            };
            if (isCompany) {
                regData.personal_data = {
                    first_name: userData.firstName,
                    last_name: userData.lastName
                };
                regData.company_data = {
                    company_id: userData.personalId,
                    country: userData.companyCountry,
                    name: userData.companyName
                };
            }
            var is_tc_confirmed = true;
            if (userData.acceptedTerms === false) {
                is_tc_confirmed = false;
                if (isCompany) {
                    $("#companyConfirmTerms").parent().find(".errormsg").text(validator.getErrMessage("required"));
                } else {
                    $("#individualConfirmTerms").parent().find(".errormsg").text(validator.getErrMessage("required"));
                }
            } else {
                $("#companyConfirmTerms-errp").remove();
            }
            form.validate();
            console.log("User Data", userData, grecaptcha_str, form.valid(), is_tc_confirmed, "END");
            if (form.valid() && is_tc_confirmed == true) {
                console.log("Form dataz ", userData);
                var affCode = localStorage.getItem("p2pAffCode");
                if (typeof affCode !== "undefined") {
                    regData.aff_code = affCode;
                }
                regData.personal_data.preferred_lang = TB.ui_lang;
                if (typeof TB.ui_lang == "undefined") {
                    regData.personal_data.preferred_lang = "en_US";
                }

                const url = "http://localhost/p2pinvestment/api/userpifi";
                const regDatatoSend = regData

                fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                
                },
                body: JSON.stringify(regDatatoSend)
                })
                .then(response => response.json())
                .then(data => {
                    console.log("Data", data);
                    
                    if (data.message === "UserPifi created successfully") {
                    // Handle success
                    $(".reg-error-msg").remove();
                    $(".success-msg").removeClass("hidden");
                    localStorage.setItem("p2pRegEmail", regData.email);
                    localStorage.setItem("p2pRegIdHash", JSON.stringify(data.user_id));
                    window.location.href = "thank-you?email="+regData.email;
                    } else {
                    // Handle errors
                    $(".reg-error-msg").remove();
                    $(".p2p_reg_form_register_btn_new").after('<div class="reg-error-msg invalid-msg">' + JSON.stringify(data.error) + "</div>");
                    }
                })
                .catch(error => {
                    // Handle fetch error
                    $(".reg-error-msg").remove();
                    $(".p2p_reg_form_register_btn_new").after('<div class="reg-error-msg invalid-msg">' + error.message + "</div>");
                    // grecaptcha.reset();
                });


            } else {
                focusFirstError();
            }
        });
        $("#p2p_reg_form_register_btn").on("click", function(ev) {
            ev.preventDefault();
            var $this = $(this);
            var form = $("#p2p_reg_form");
            var userData, url;
            var isCompany = false;
            if (individual.is(":checked")) {
                userData = _getIndividualUserData();
            } else if (company.is(":checked")) {
                userData = _getCompanyUserData();
                isCompany = true;
            }
            var grecaptcha_str = grecaptcha.getResponse();
            var regData = {
                login: userData.email,
                password: userData.password,
                personal_data: {
                    emails: [ userData.email ],
                    phones: [ userData.phone ],
                    preferred_lang: userData.preferredLanguage,
                    contact_country: userData.passportCountry,
                    contact_city: userData.passportTown,
                    contact_post_code: userData.passportPostCode,
                    contact_address: userData.passportAddress,
                    pid_country: userData.currentCountry,
                    pid_city: userData.currentTown,
                    pid_post_code: userData.currentPostCode,
                    pid_address: userData.currentAddress,
                    first_name: userData.firstName,
                    last_name: userData.middleName + " " + userData.lastName,
                    birth_date: userData.birthDate,
                    birth_country: userData.birthCountry,
                    personal_number: userData.personalId
                },
                company_data: {},
                is_tc_confirmed: userData.acceptedTerms,
                is_email_verified: false,
                is_company: isCompany,
                // grecaptcha_resp: grecaptcha_str
            };
            if (isCompany) {
                regData.personal_data = {
                    emails: [ userData.email ],
                    phones: [ userData.phone ],
                    preferred_lang: userData.preferredLanguage,
                    contact_country: userData.currentCountry,
                    contact_city: userData.currentTown,
                    contact_post_code: userData.currentPostCode,
                    contact_address: userData.currentAddress
                };
                regData.company_data = {
                    activity_id: userData.activity,
                    rp_first_name: userData.firstName,
                    rp_last_name: userData.middleName + " " + userData.lastName,
                    company_id: userData.personalId,
                    country: userData.companyCountry,
                    city: userData.companyTown,
                    address: userData.companyAddress,
                    name: userData.companyName
                };
            }
            console.log("Form data 1 ", userData);
            var is_tc_confirmed = true;
            if ($("#companyConfirmTerms").is(":checked") === false) {
                is_tc_confirmed = false;
                $("#companyConfirmTerms").parent().prepend('<span class="error" id="companyConfirmTerms-errp">' + validator.getErrMessage("required") + "</span>");
            } else {
                $("#companyConfirmTerms-errp").remove();
            }
            form.validate();
            if (form.valid() && grecaptcha_str.length > 0 && is_tc_confirmed == true) {
                console.log("Form dataz ", userData);
                TB.load({
                    url: p2p_ui_url + "?p0=register",
                    method: "POST",
                    data: {
                        data: JSON.stringify(regData)
                    },
                    successCallback: function(data) {
                        console.log("Data ", data);
                        if (data.data.status.status == "ok") {
                            $(".reg-error-msg").remove();
                            $(".success-msg").removeClass("hidden");
                        } else {
                            $(".reg-error-msg").remove();
                            $("#p2p_reg_form_register_btn").after('<div class="reg-error-msg invalid-msg">' + data.data.status.msg + "</div>");
                        }
                    },
                    alwaysCallback: function() {},
                    errorCallback: function(data) {
                        $(".reg-error-msg").remove();
                        $("#p2p_reg_form_register_btn").after('<div class="reg-error-msg invalid-msg">' + data.msg + "</div>");
                        grecaptcha.reset();
                    }
                });
            } else {
                focusFirstError();
            }
        });
        $("#individualCountry").on("change", function() {
            $("#individualTempContactCountry").val(this.value);
        });
        $("#companyCountry").on("change", function() {
            $("#companyTempContactCountry").val(this.value);
        });
        copyTextInput($("#individualCity"), $("#individualTempCity"));
        copyTextInput($("#individualZipCode"), $("#individualTempZipCode"));
        copyTextInput($("#individualAddress"), $("#individualTempAddress"));
        copyTextInput($("#companyCity"), $("#companyTempCity"));
        copyTextInput($("#companyAddress"), $("#companyCorrespondanceAddress"));
        function copyTextInput($source, $destination) {
            $source.on("blur", function() {
                $destination.val(this.value);
            });
        }
        $("form#p2p_reg_form_new").validate({
            errorClass: "errormsg",
            rules: {
                repeatNewPass: {
                    required: true,
                    passwordEqualTo: true
                },
                groups: {
                    groupIndividualRegFields: "individualCountry individualName individualLastName individualEmail phone individualPass individualRepeatPass individualConfirmTerms"
                },
                individualCountry: {
                    required: "#reg-individual:checked",
                    lettersLatinOnlyExp: "#reg-individual:checked"
                },
                individualName: {
                    required: "#reg-individual:checked",
                    lettersLatinOnlyExp: "#reg-individual:checked"
                },
                individualLastName: {
                    required: "#reg-individual:checked",
                    lettersLatinOnlyExp: "#reg-individual:checked"
                },
                individualEmail: {
                    required: "#reg-individual:checked",
                    iuvoEmail: "#reg-individual:checked"
                },
                phone: {
                    allDigitsExp: "#reg-individual:checked"
                },
                phoneCountryCode: {
                    required: function(element) {
                        if (typeof $("#reg-individual:checked").val() !== "undefined" && $("#phone").val().length > 0) {
                            return true;
                        }
                        return false;
                    }
                },
                individualPass: {
                    required: "#reg-individual:checked",
                    passwordFormatNew: "#reg-individual:checked"
                },
                individualRepeatPass: {
                    required: "#reg-individual:checked",
                    passwordEqualTo: "#reg-individual:checked"
                },
                individualConfirmTerms: {
                    required: "#reg-individual:checked"
                },
                companyFirmName: {
                    required: "#reg-company:checked",
                    allLatinCharactersSpec: validator.getErrMessage("allLatinCharactersSpec")
                },
                companyEIK: {
                    required: "#reg-company:checked",
                    lettersLatinNumbersOnlyExp: validator.getErrMessage("lettersLatinOrNumbers")
                },
                companyCountry: {
                    required: "#reg-company:checked"
                },
                companyNameMOL: {
                    required: "#reg-company:checked",
                    lettersLatinOnlyExp: validator.getErrMessage("lettersLatin")
                },
                companyLastNameMOL: {
                    required: "#reg-company:checked",
                    lettersLatinOnlyExp: validator.getErrMessage("lettersLatin")
                },
                companyPhone: {
                    allDigitsExp: "#reg-company:checked"
                },
                companyPhoneCountryCode: {
                    required: function(element) {
                        if (typeof $("#reg-company:checked").val() !== "undefined" && $("#companyPhone").val().length > 0) {
                            return true;
                        }
                        return false;
                    }
                },
                companyMail: {
                    required: "#reg-company:checked",
                    iuvoEmail: "#reg-company:checked"
                },
                companyPass: {
                    required: "#reg-company:checked",
                    passwordFormatNew: "#reg-company:checked"
                },
                companyRepeatPass: {
                    required: "#reg-company:checked",
                    passwordEqualTo: "#reg-company:checked"
                },
                companyConfirmTerms: {
                    required: true
                }
            },
            messages: {
                repeatNewPass: {
                    required: validator.getErrMessage("required"),
                    passwordEqualTo: validator.getErrMessage("passwordEqualTo")
                },
                individualCountry: validator.getErrMessage("required"),
                individualName: {
                    required: validator.getErrMessage("required"),
                    lettersLatinOnlyExp: validator.getErrMessage("lettersLatin")
                },
                individualLastName: {
                    required: validator.getErrMessage("required"),
                    lettersLatinOnlyExp: validator.getErrMessage("lettersLatin")
                },
                individualEmail: {
                    required: validator.getErrMessage("required"),
                    iuvoEmail: validator.getErrMessage("email")
                },
                phone: {
                    allDigitsExp: validator.getErrMessage("allDigits")
                },
                phoneCountryCode: validator.getErrMessage("required"),
                individualPass: {
                    required: validator.getErrMessage("required"),
                    passwordFormatNew: validator.getErrMessage("passwordFormatNew")
                },
                individualRepeatPass: {
                    required: validator.getErrMessage("required"),
                    passwordEqualTo: validator.getErrMessage("passwordEqualTo")
                },
                individualConfirmTerms: validator.getErrMessage("required"),
                companyFirmName: {
                    required: validator.getErrMessage("required"),
                    allLatinCharactersSpec: validator.getErrMessage("allLatinCharactersSpec")
                },
                companyEIK: {
                    required: validator.getErrMessage("required"),
                    lettersLatinNumbersOnlyExp: validator.getErrMessage("lettersLatinOrNumbers")
                },
                companyCountry: validator.getErrMessage("required"),
                companyNameMOL: {
                    required: validator.getErrMessage("required"),
                    lettersLatinOnlyExp: validator.getErrMessage("lettersLatin")
                },
                companyLastNameMOL: {
                    required: validator.getErrMessage("required"),
                    lettersLatinOnlyExp: validator.getErrMessage("lettersLatin")
                },
                companyPhone: {
                    allDigitsExp: validator.getErrMessage("allDigits")
                },
                companyPhoneCountryCode: validator.getErrMessage("required"),
                companyMail: {
                    required: validator.getErrMessage("required"),
                    iuvoEmail: validator.getErrMessage("email")
                },
                companyPass: {
                    required: validator.getErrMessage("required"),
                    passwordFormatNew: validator.getErrMessage("passwordFormatNew")
                },
                companyRepeatPass: {
                    required: validator.getErrMessage("required"),
                    passwordEqualTo: validator.getErrMessage("passwordEqualTo")
                },
                companyConfirmTerms: validator.getErrMessage("required")
            },
            errorPlacement: function(error, element) {
                console.log("before error type ", $(element).attr("type"), $(element).attr("id"), $("#companyConfirmTerms").val());
                if ($(element).attr("id").indexOf("phone") != -1 || $(element).attr("id").indexOf("Phone") != -1) {
                    $(element).parent().parent().find("span.errormsg").text(error.text()).show();
                } else {
                    $(element).parent().find("span.errormsg").text(error.text()).show();
                }
            },
            onfocusout: function(element, event) {
                var value = $(element).val();
                if (value == null) value = "";
                value = value.trim();
                $(element).val(value);
                if ($(element).valid()) {
                    $(element).parent().find("span.errormsg").text("");
                    $(element).parent().parent().find("span.errormsg").text("");
                }
            }
        });
        $("form#p2p_login_form, form#p2p_reg_form, form#p2p_reset_pass_form, form#p2p_forgot_pass_form").validate({
            rules: {
                loginEmail: {
                    required: true,
                    iuvoEmail: true
                },
                loginPass: {
                    required: true
                },
                resetPassEmail: {
                    required: true,
                    iuvoEmail: true
                },
                newPass: {
                    required: true,
                    passwordFormatNew: true
                },
                repeatNewPass: {
                    required: true,
                    passwordEqualTo: true
                },
                groups: {
                    groupIndividualRegFields: "individualCountry individualName individualSurname individualLastName birthDate birthPlace personalId individualCitizenship individualCity individualZipCode individualAddress individualEmail phone individualPass individualRepeatPass individualConfirmTerms"
                },
                individualCountry: {
                    required: "#reg-individual:checked",
                    lettersLatinOnlyExp: "#reg-individual:checked"
                },
                individualCity: {
                    required: "#reg-individual:checked",
                    lettersLatinOnlyExp: "#reg-individual:checked"
                },
                individualZipCode: {
                    required: "#reg-individual:checked",
                    lettersLatinNumbersOnlyExp: "#reg-individual:checked"
                },
                individualAddress: {
                    required: "#reg-individual:checked",
                    allLatinCharactersSpec: "#reg-individual:checked"
                },
                individualName: {
                    required: "#reg-individual:checked",
                    lettersLatinOnlyExp: "#reg-individual:checked"
                },
                individualSurname: {
                    lettersLatinOnlyExp: "#reg-individual:checked"
                },
                individualLastName: {
                    required: "#reg-individual:checked",
                    lettersLatinOnlyExp: "#reg-individual:checked"
                },
                birthDate: {
                    required: "#reg-individual:checked",
                    legalAge: "#reg-individual:checked"
                },
                birthPlace: {
                    required: "#reg-individual:checked"
                },
                personalId: {
                    required: "#reg-individual:checked",
                    lettersLatinNumbersOnlyExp: "#reg-individual:checked"
                },
                individualContactCountry: {
                    required: "#reg-individual:checked"
                },
                individualTempCity: {
                    required: "#reg-individual:checked"
                },
                individualTempZipCode: {
                    required: "#reg-individual:checked"
                },
                individualTempAddress: {
                    required: "#reg-individual:checked",
                    allLatinCharactersSpec: "#reg-individual:checked"
                },
                individualEmail: {
                    required: "#reg-individual:checked",
                    iuvoEmail: "#reg-individual:checked"
                },
                phone: {
                    required: "#reg-individual:checked"
                },
                individualPass: {
                    required: "#reg-individual:checked",
                    passwordFormat: "#reg-individual:checked"
                },
                individualRepeatPass: {
                    required: "#reg-individual:checked",
                    passwordEqualTo: "#reg-individual:checked"
                },
                individualConfirmTerms: {
                    required: "#reg-individual:checked"
                },
                companyCountry: {
                    required: "#reg-company:checked"
                },
                companyCity: {
                    required: "#reg-company:checked",
                    lettersLatinOnlyExp: validator.getErrMessage("lettersLatin")
                },
                companyAddress: {
                    required: "#reg-company:checked",
                    allLatinCharactersSpec: validator.getErrMessage("allLatinCharactersSpec")
                },
                companyFirmName: {
                    required: "#reg-company:checked",
                    allLatinCharactersSpec: validator.getErrMessage("allLatinCharactersSpec")
                },
                companyEIK: {
                    required: "#reg-company:checked",
                    lettersLatinNumbersOnlyExp: validator.getErrMessage("lettersLatinOrNumbers")
                },
                companyNameMOL: {
                    required: "#reg-company:checked",
                    lettersLatinOnlyExp: validator.getErrMessage("lettersLatin")
                },
                companyMiddleNameMOL: {
                    lettersLatinOnlyExp: validator.getErrMessage("lettersLatin")
                },
                companyLastNameMOL: {
                    required: "#reg-company:checked",
                    lettersLatinOnlyExp: validator.getErrMessage("lettersLatin")
                },
                companyTempContactCountry: {
                    required: "#reg-company:checked"
                },
                companyTempCity: {
                    required: "#reg-company:checked",
                    lettersLatinOnlyExp: validator.getErrMessage("lettersLatin")
                },
                companyCorrespondanceAddress: {
                    required: "#reg-company:checked",
                    allLatinCharacters: validator.getErrMessage("allLatinCharacters")
                },
                companyPostCode: {
                    required: "#reg-company:checked",
                    lettersLatinNumbersOnlyExp: validator.getErrMessage("lettersLatinOrNumbers")
                },
                companyPhone: {
                    required: "#reg-company:checked"
                },
                companyMail: {
                    required: "#reg-company:checked",
                    iuvoEmail: "#reg-company:checked"
                },
                companyActivity: {
                    required: "#reg-company:checked"
                },
                companyPass: {
                    required: "#reg-company:checked",
                    passwordFormat: "#reg-company:checked"
                },
                companyRepeatPass: {
                    required: "#reg-company:checked",
                    passwordEqualTo: "#reg-company:checked"
                },
                companyConfirmTerms: {
                    required: true
                }
            },
            messages: {
                loginEmail: {
                    required: validator.getErrMessage("required"),
                    iuvoEmail: validator.getErrMessage("email")
                },
                loginPass: validator.getErrMessage("required"),
                resetPassEmail: {
                    required: validator.getErrMessage("required"),
                    iuvoEmail: validator.getErrMessage("email")
                },
                newPass: {
                    required: validator.getErrMessage("required"),
                    passwordFormatNew: validator.getErrMessage("passwordFormatNew")
                },
                repeatNewPass: {
                    required: validator.getErrMessage("required"),
                    passwordEqualTo: validator.getErrMessage("passwordEqualTo")
                },
                individualCountry: validator.getErrMessage("required"),
                individualCity: {
                    required: validator.getErrMessage("required"),
                    lettersLatinOnlyExp: validator.getErrMessage("lettersLatin")
                },
                individualName: {
                    required: validator.getErrMessage("required"),
                    lettersLatinOnlyExp: validator.getErrMessage("lettersLatin")
                },
                individualSurname: {
                    lettersLatinOnlyExp: validator.getErrMessage("lettersLatin")
                },
                individualLastName: {
                    required: validator.getErrMessage("required"),
                    lettersLatinOnlyExp: validator.getErrMessage("lettersLatin")
                },
                birthDate: {
                    required: validator.getErrMessage("required"),
                    legalAge: validator.getErrMessage("legalAge")
                },
                birthPlace: validator.getErrMessage("required"),
                personalId: {
                    required: validator.getErrMessage("required"),
                    lettersLatinNumbersOnlyExp: validator.getErrMessage("lettersLatinOrNumbers")
                },
                individualContactCountry: {
                    required: validator.getErrMessage("required")
                },
                individualTempCity: {
                    required: validator.getErrMessage("required"),
                    lettersLatinOnlyExp: validator.getErrMessage("lettersLatin")
                },
                individualTempZipCode: validator.getErrMessage("required"),
                individualTempAddress: {
                    required: validator.getErrMessage("required"),
                    allLatinCharactersSpec: validator.getErrMessage("allLatinCharactersSpec")
                },
                individualZipCode: {
                    required: validator.getErrMessage("required"),
                    lettersLatinNumbersOnlyExp: validator.getErrMessage("lettersLatinOrNumbers")
                },
                individualAddress: {
                    required: validator.getErrMessage("required"),
                    allLatinCharactersSpec: validator.getErrMessage("allLatinCharactersSpec")
                },
                individualEmail: {
                    required: validator.getErrMessage("required"),
                    iuvoEmail: validator.getErrMessage("email")
                },
                phone: validator.getErrMessage("required"),
                individualPass: {
                    required: validator.getErrMessage("required"),
                    passwordFormat: validator.getErrMessage("passwordFormat")
                },
                individualRepeatPass: {
                    required: validator.getErrMessage("required"),
                    passwordEqualTo: validator.getErrMessage("passwordEqualTo")
                },
                individualConfirmTerms: validator.getErrMessage("required"),
                companyCountry: validator.getErrMessage("required"),
                companyCity: {
                    required: validator.getErrMessage("required"),
                    lettersLatinOnlyExp: validator.getErrMessage("lettersLatin")
                },
                companyFirmName: {
                    required: validator.getErrMessage("required"),
                    allLatinCharactersSpec: validator.getErrMessage("allLatinCharactersSpec")
                },
                companyAddress: {
                    required: validator.getErrMessage("required"),
                    allLatinCharactersSpec: validator.getErrMessage("allLatinCharactersSpec")
                },
                companyEIK: {
                    required: validator.getErrMessage("required"),
                    lettersLatinNumbersOnlyExp: validator.getErrMessage("lettersLatinOrNumbers")
                },
                companyNameMOL: {
                    required: validator.getErrMessage("required"),
                    lettersLatinOnlyExp: validator.getErrMessage("lettersLatin")
                },
                companyMiddleNameMOL: {
                    lettersLatinOnlyExp: validator.getErrMessage("lettersLatin")
                },
                companyLastNameMOL: {
                    required: validator.getErrMessage("required"),
                    lettersLatinOnlyExp: validator.getErrMessage("lettersLatin")
                },
                companyTempContactCountry: validator.getErrMessage("required"),
                companyTempCity: {
                    required: validator.getErrMessage("required"),
                    lettersLatinOnlyExp: validator.getErrMessage("lettersLatin")
                },
                companyCorrespondanceAddress: {
                    required: validator.getErrMessage("required"),
                    allLatinCharacters: validator.getErrMessage("allLatinCharacters")
                },
                companyPostCode: validator.getErrMessage("required"),
                companyPhone: validator.getErrMessage("required"),
                companyMail: {
                    required: validator.getErrMessage("required"),
                    iuvoEmail: validator.getErrMessage("email")
                },
                companyActivity: {
                    required: validator.getErrMessage("required"),
                    lettersLatinOnlyExp: validator.getErrMessage("lettersLatin")
                },
                companyPass: {
                    required: validator.getErrMessage("required"),
                    passwordFormat: validator.getErrMessage("passwordFormat")
                },
                companyRepeatPass: {
                    required: validator.getErrMessage("required"),
                    passwordEqualTo: validator.getErrMessage("passwordEqualTo")
                },
                companyConfirmTerms: validator.getErrMessage("required")
            },
            errorPlacement: function(error, element) {
                console.log("before error type ", $(element).attr("type"), $(element).attr("id"), $("#companyConfirmTerms").val());
                if ($(element).attr("type") == "checkbox" || $(element).attr("type") == "radio") {
                    console.log("Elemnent errrrrrrrr id ", $(element).attr("id"));
                    if ($(element).attr("id").indexOf("ConfirmTerms") != -1) {
                        $(element).parent().prepend(error);
                    } else {
                        $(element).parent().parent().append(error);
                    }
                } else if ($(element).attr("name") == "birthDate") {
                    error.insertBefore($("#datetimepicker1"));
                } else {
                    error.insertBefore(element);
                }
            },
            onfocusout: function(element, event) {
                var value = $(element).val();
                if (value == null) value = "";
                value = value.trim();
                $(element).val(value);
                $(element).valid();
            }
        });
    });
})(jQuery, window.document);
