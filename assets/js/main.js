window.arrowNavigation.init({preventScroll: true, debug: true});
let focus_sound = false;
var active_elem = "";
var started = false;
const navigationApi = window.arrowNavigation.get();
$(document).ready(function(){
    navigationApi.registerGroup("group-0");

    $("#group-0 button").each(function(){
        var elem = $(this);
        navigationApi.registerElement(elem.attr("id"), "group-0", {
            onFocus: () => {
                if(focus_sound == true){
                    new Audio("/assets/sounds/choose.wav").play();
                }
                var scrollto = 0
                elem.prevAll().each(function(){
                    scrollto = scrollto + $(this).width();
                });
                $(".MainContentI").animate({scrollLeft: scrollto});
            }
        }); 
    });

    $(document).on('click', '.Selectable', function(){
        new Audio('/assets/sounds/SelectA2.wav').play();
    });

    $(document).keyup(function(e) {
        console.log(e.key);
        if(e.key === "Escape" && $(".J_Scr_Active").length != 0){
            new Audio("/assets/sounds/back.wav").play();
            $(".MainContent").show();
            $(".MainContent").css("transform", "");
            $(".MainContent").css("opacity", "");
            new Audio("/assets/sounds/return.wav").play();
            focus_sound = false;
            navigationApi.setFocusElement(active_elem);
            $("#BtNBa").hide();
            $(".J_Scr").fadeOut(200);
            $(".MainContentIElement").css("transform", "");
            setTimeout(() => {
                $(`.MainContentIElement:not(#${active_elem})`).css("transition", "");
                $(".MainContentIElementActive").removeClass("MainContentIElementActive");
            }, 1000);
            focus_sound = true;
            $(".J_Scr_Active").removeClass('J_Scr_Active');
        }
    });

    function resizeDiv() {
        const screenWidth = $(window).width(); 
        const screenHeight = $(window).height(); 
        const divWidth = 1920;
        const divHeight = 1080; 

        const scaleWidth = screenWidth / divWidth;
        const scaleHeight = screenHeight / divHeight;

        const scale = Math.min(scaleWidth, scaleHeight); 

        $('#application').css('transform', `scale(${scale})`);
    }

    resizeDiv();

    $(window).resize(resizeDiv);

    $(document).on("click", ".StartUpBtn", function(){
        $(".StartUpVideo")[0].play();
        $("body").prepend("<div style='position:fixed;width:100vw;height:100vh;z-index:102048;'></div>");
        $(this).remove();
        setTimeout(() => {
            $("#application").addClass("app_FIn");
            $(".MainContent").show();
            navigationApi.setFocusElement("item-0-0");
            new Audio("/assets/sounds/load.wav").play();
            $(".MainContentIElement:not(:nth-child(1))").css("animation", "sections_s 1s");
            $(".MainContentIElement:not(:nth-child(1))").css("z-index", "10");
            setTimeout(() => {
                $(".MainContentIElement:not(:nth-child(1))").css("animation", "");
                $(".MainContentIElement:not(:nth-child(1))").css("z-index", "");
            }, 1200);
            focus_sound = true;
            started = true;
            $(".StartUpVideo").remove();
        }, 10000)
    });
});
function goToScreen(element, which){
    $(".MainContentIElementActive").removeClass("MainContentIElementActive");
    active_elem = element.attr("id");
    if(element.next().length == 0){
        var width_t = element.width();
        element.prevAll().each(function(i){
            width_t = element.width() * (i + 1);
            width_t = width_t + (13.5 * element.prevAll().length);
            $(this).css("transform", `translateX(${width_t}px)`);
        });
    }else if(element.prev().length == 0){
        var width_t = element.width();
        element.nextAll().each(function(i){
            width_t = element.width() * (i + 1);
            width_t = width_t + (13.5 * element.nextAll().length);
            $(this).css("transform", `translateX(-${width_t}px)`);
        });
    }else{
        var width_t = element.width();
        element.nextAll().each(function(i){
            width_t = element.width() * (i + 1);
            width_t = width_t + (13.5 * element.nextAll().length);
            $(this).css("transform", `translateX(-${width_t}px)`);
        });
        element.prevAll().each(function(i){
            width_t = element.width() * (i + 1);
            width_t = width_t + (13.5 * element.prevAll().length);
            $(this).css("transform", `translateX(${width_t}px)`);
        });
    }
    element.addClass("MainContentIElementActive");
    $(`.MainContentIElement:not(#${element.attr("id")})`).css("transition", "transform .5s .25s");
    $("#BtNBa").show();
    new Audio("/assets/sounds/SelectA2.wav").play();
    $(".MainContent").css("opacity", "0");
    $(".MainContent").css("transform", "scale(2)");
    $(which).fadeIn(200);
    $(which).addClass('J_Scr_Active');
    setTimeout(() => {
        $(".MainContent").hide();
    }, 500);
    if($(which).find(".SCrJ_Group").length > 0){
        $(which).find(".SCrJ_Group").each(function(){
            var group = $(this);
            navigationApi.registerGroup(group.attr("id"));

            $(this).find("button").each(function(){
                var elem = $(this);
                navigationApi.registerElement(elem.attr("id"), group.attr("id"), {onFocus: () => {
                    if($(which).hasClass("J_Scr_Active")){
                        new Audio("/assets/sounds/Select2.wav").play();
                        if(typeof elem.data("scrjdo") !== 'undefined'){
                            if(elem.data('scrjdo') == 'change_text_dual'){
                                $(".J_Scr_Active .J_Scr_Dual_S span").html(elem.data("text"));
                            }
                        }
                    }
                }}); 
            });
            navigationApi.setFocusElement($(this).find("button:first-child").attr("id"));
        })
    }
}
