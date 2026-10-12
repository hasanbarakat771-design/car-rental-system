$(document).ready(function() {
    // 1. إظهار وإخفاء التفاصيل باستخدام JQuery
    $(".details-checkbox").change(function() {
        var targetId = $(this).attr("data-target");
        if (this.checked) {
            $("#" + targetId).fadeIn();
        } else {
            $("#" + targetId).fadeOut();
        }
    });

    // 2. إظهار نموذج الحجز عند الضغط على متابعة
    $("#btnContinue").click(function() {
        var selectedCount = $(".car-select:checked").length;
        if (selectedCount > 0) {
            $("#bookingSection").slideDown();
            $('html, body').animate({
                scrollTop: $("#bookingSection").offset().top
            }, 500);
        } else {
            alert("يرجى اختيار سيارة واحدة على الأقل للمتابعة.");
        }
    });
});

// 3. التحقق من صحة مدخلات النموذج وحساب التكلفة بـ JavaScript
function validateAndCalculate() {
    var isValid = true;

    // جلب القيمة
    var fullName = document.getElementById("fullName").value.trim();
    var nationalId = document.getElementById("nationalId").value.trim();
    var startDateVal = document.getElementById("startDate").value;
    var endDateVal = document.getElementById("endDate").value;
    var mobile = document.getElementById("mobile").value.trim();
    var email = document.getElementById("email").value.trim();

    // إخفاء الأخطاء السابقة
    $(".error-msg").hide();

    // أ) التحقق من الاسم (أحرف عربية فقط)
    var arabicPattern = /^[\u0600-\u06FF\s]+$/;
    if (fullName !== "" && !arabicPattern.test(fullName)) {
        $("#errFullName").text("الاسم يجب أن يحتوي على أحرف عربية فقط.").show();
        isValid = false;
    }

    // ب) التحقق من الرقم الوطني (إلزامي، 11 خانة، أول خانتين بين 01 و 14)
    var idPattern = /^(0[1-9]|1[0-4])\d{9}$/;
    if (!idPattern.test(nationalId)) {
        $("#errNationalId").text("الرقم الوطني إلزامي ويجب أن يتكون من 11 خانة ويبدأ بمحافظة صحيحة (01-14).").show();
        isValid = false;
    }

    // ج) التحقق من التواريخ (إلزامية والتسلسل الزمني)
    if (!startDateVal || !endDateVal) {
        $("#errDates").text("تواريخ بداية ونهاية التأجير إلكتراونية وإلزامية.").show();
        isValid = false;
    } else {
        var startDate = new Date(startDateVal);
        var endDate = new Date(endDateVal);
        
        if (endDate <= startDate) {
            $("#errDates").text("تاريخ نهاية التأجير يجب أن يكون لاحقاً لتاريخ البداية.").show();
            isValid = false;
        }
    }

    // د) التحقق من الموبايل (Syriatel / MTN)
    var mobilePattern = /^09(3|4|5|6|8|9)\d{7}$/;
    if (mobile !== "" && !mobilePattern.test(mobile)) {
        $("#errMobile").text("رقم الموبايل غير صحيح (يجب أن يبدأ بـ 093, 094, 095, 096, 098, 099 ويكون 10 أرقام).").show();
        isValid = false;
    }

    // هـ) التحقق من البريد الإلكتروني (إن وُجد)
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email !== "" && !emailPattern.test(email)) {
        $("#errEmail").text("صيغة البريد الإلكتروني غير صحيحة.").show();
        isValid = false;
    }

    // في حال عدم وجود أخطاء في الإدخال: إجراء الحسابات
    if (isValid) {
        var diffTime = Math.abs(new Date(endDateVal) - new Date(startDateVal));
        var days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        var totalDailyRate = 0;
        var selectedCarsList = "";

        $(".car-select:checked").each(function() {
            var carModel = $(this).attr("data-model");
            var carPrice = parseFloat($(this).attr("data-price"));
            totalDailyRate += carPrice;
            selectedCarsList += "<li>" + carModel + " (" + carPrice.toLocaleString() + " ل.س/يوم)</li>";
        });

        var grandTotal = totalDailyRate * days;
        var discount = 0;

        if (days > 7) {
            discount = grandTotal * 0.10;
        }

        var finalAmount = grandTotal - discount;

        // عرض النتيجة
        var resultHtml = "<h3>تفاصيل حجزك:</h3>";
        resultHtml += "<p><strong>السيارات المختارة:</strong></p><ul>" + selectedCarsList + "</ul>";
        resultHtml += "<p><strong>عدد أيام التأجير:</strong> " + days + " يوم</p>";
        resultHtml += "<p><strong>المبلغ الإجمالي قبل الخصم:</strong> " + grandTotal.toLocaleString() + " ل.س</p>";
        if (discount > 0) {
            resultHtml += "<p style='color:green;'><strong>تم تطبيق خصم 10% لتجاوز الإقامة 7 أيام:</strong> -" + discount.toLocaleString() + " ل.س</p>";
        }
        resultHtml += "<h4><strong>المبلغ النهائي المترتب أدائه:</strong> " + finalAmount.toLocaleString() + " ل.س</h4>";

        $("#resultModal").html(resultHtml).slideDown();
    }

    return false; // منع إعادة تحميل الصفحة
}