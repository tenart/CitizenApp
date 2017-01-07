$(function() {
    
    if (localStorage.getItem("lastQ") === null) {
        window.lastQ = ".entry:nth-child(1)";
        localStorage.setItem("lastQ", lastQ);
    } else {
        lastQ = localStorage.getItem("lastQ");
    };
        
    if (localStorage.getItem("gender") === null) {
        window.speechGender = 0;
        localStorage.setItem("gender", speechGender);
    } else {
        speechGender = localStorage.getItem("gender");
    };
    
    //Creates array if not there and loads saved questions from localStorage and applying proper classes to them
    if (localStorage.getItem("fav") === null) {
        window.savedQ = [];
        localStorage.setItem("fav", JSON.stringify(savedQ));
    } else {
        savedQ = JSON.parse(localStorage.getItem("fav"));
        jQuery.each(savedQ, function( i, val ) {
            $(val).addClass("fave").animate({
                backgroundPositionX: "97%"
            }, 150);;
        });
    };
    
    if (localStorage.getItem("rate") === null) {
        window.speechRate = 1;
        localStorage.setItem("rate", speechRate);
    } else {
        speechRate = localStorage.getItem("rate");
    };
    
    if (localStorage.getItem("volume") === null) {
        window.speechVolume = 1;
        localStorage.setItem("volume", speechRate);
    } else {
        speechVolume = localStorage.getItem("volume");
    };
    
    function voiceStartCallback() {
        $("#speak").css("background-image", "url(images/Speaking-100.png)");
    };

    function voiceEndCallback() {
        $("#speak").css("background-image", "url(images/Speak-100.png)");
    };
    
    function voiceStartCallbackA() {
        $("#speak_answer").css("background-image", "url(images/Speaking-100.png)");
    };

    function voiceEndCallbackA() {
        $("#speak_answer").css("background-image", "url(images/Speak-100.png)");
    };
    
    function voiceStartCallbackAT() {
        $("#audio_test img").attr("src", "images/Speaking-100.png");
    };

    function voiceEndCallbackAT() {
        $("#audio_test img").attr("src", "images/Speak-100.png");
    };
    
    $("#settings").click(function() {
        $("#panel_wrapper").fadeIn(100);
        $("#panel").slideDown(200);
    });
    
    $("#close").click(function() {
        $("#panel_wrapper").fadeOut(200);
        $("#panel").slideUp(100);
    });
    
    function setVoiceProperties(speakThis, onStart, onEnd) {
        speechRate = $("#speech_rate").val();
        speechVolume = $("#speech_volume").val();
        speechGender = $("#speech_gender").val();
        
        localStorage.setItem("rate", speechRate);
        localStorage.setItem("volume", speechVolume);
        localStorage.setItem("gender", speechGender);
        
        window.newUtterance = new SpeechSynthesisUtterance(speakThis);
        newUtterance.onstart = onStart;
        newUtterance.onend = onEnd;
        newUtterance.rate = speechRate;
        newUtterance.volume = speechVolume;
        
        if (speechGender == 0) {
            newUtterance.voice = speechSynthesis.getVoices().filter(function(voice) { return voice.name == 'Daniel'; })[0];
        } else {
            newUtterance.voice = speechSynthesis.getVoices().filter(function(voice) { return voice.name == 'Samantha'; })[0];
        }
    }
    
    $("#speech_rate").change(function() {
        setVoiceProperties();
    });
    
    $("#speech_volume").change(function() {
        setVoiceProperties();
    });
    
    $("#speech_gender").change(function() {
        setVoiceProperties();
    });
    
    $("#speak").click(function() {
        setVoiceProperties( $("#top_readout p#main_q_en").text(), voiceStartCallback, voiceEndCallback );
        speechSynthesis.speak(newUtterance);
    });
    
    $("#speak_answer").click(function() {
        setVoiceProperties( $("#answer_readout p#main_a_en").text(), voiceStartCallbackA, voiceEndCallbackA );
        speechSynthesis.speak(newUtterance);
    });
    
    $("#audio_test").click(function() {
        setVoiceProperties( "The Constitution is the Supreme Law of the Land", voiceStartCallbackAT, voiceEndCallbackAT  );
        speechSynthesis.speak(newUtterance);
    });
    
    $(".entry").click(function() {
        changeQuestion(this);
        
        var qName = ".entry:nth-child(" + $(this).children("p.number").text() + ")";
        
        lastQ = qName;
        localStorage.setItem("lastQ", lastQ);
    });
    
    $("#next").click(function() {
        var currentQ = parseInt($("#bg_number").text(), 10),
            nextQ = currentQ + 1;
        if ( currentQ != NaN ) {
            var qNumber = '.entry:nth-child(' + nextQ + ')';
            var $thisEntry = $(qNumber);
            changeQuestion($thisEntry);
            
            lastQ = qNumber;
            localStorage.setItem("lastQ", lastQ);
        };
    });
    
    $("#back").click(function() {
        var currentQ = parseInt($("#bg_number").text(), 10),
            nextQ = currentQ - 1;
        if ( currentQ >= 2) {
            var qNumber = '.entry:nth-child(' + nextQ + ')';
            var $thisEntry = $(qNumber);
            changeQuestion($thisEntry);
            
            lastQ = qNumber;
            localStorage.setItem("lastQ", lastQ);
        };
    });
    
    $("#star").click(function() {
        var currentQ = parseInt($("#bg_number").text(), 10);
            
        if ( currentQ != NaN ) {
            var qNumber = '.entry:nth-child(' + currentQ + ')';
            if ( $(qNumber).hasClass("fave") ) {
                $(qNumber).removeClass('fave');
                savedQ.splice(savedQ.indexOf(qNumber), 1);
                localStorage.setItem("fav", JSON.stringify(savedQ));
                $("#top_readout").animate({
                    backgroundSize: "0%"
                }, 150);
                
                $(qNumber).animate({
                    backgroundPositionX: "120%"
                }, 150);
                
                $("#star").css("opacity", "0.4");
                    
            } else {
                $(qNumber).addClass('fave');
                savedQ.push(qNumber);
                localStorage.setItem("fav", JSON.stringify(savedQ));
                $("#top_readout").animate({
                    backgroundSize: "300%"
                }, 150);
                
                $(qNumber).animate({
                    backgroundPositionX: "97%"
                }, 150);
                
                $("#star").css("opacity", "1");

            };
        };
    });
    
    $("#show_star").click(function() {
        if ( $(this).hasClass("initial_state") ) {
            $(".entry").each(function() {
                var $this = $(this);
                if ( $this.hasClass("fave") == false ) {
                    $this.slideUp("fast");
                };
            });
            $(this).fadeTo("fast", 1);
            $(this).removeClass("initial_state");
        } else {
            $(".entry").slideDown("fast");
            $(this).fadeTo("fast", 0.4);
            $(this).addClass("initial_state");
        };
    });
    
    $("#show_answer").click(function() {
        $("#answer_readout button").hide();
        $("#answer_readout .answer").fadeIn("fast");  
        adjustHeader();
    })
    
    $("#hide_answer").click(function() {
        $("#answer_readout button").fadeIn("fast");
        $("#answer_readout .answer").hide();  
        adjustHeader();
    })
    
    function adjustHeader() {
        var topHeight = $("#top_readout").height();
        $("#top_readout").css("margin-top", "-" + topHeight + "px")
        $("#header_offset").css("margin-top", topHeight + "px")
    };
    
    $("#slide div").click(function() {
        var jumpTo = ".entry:nth-child(" + $(this).text() + ")";
        changeQuestion(jumpTo);
        lastQ = jumpTo;
        localStorage.setItem("lastQ", lastQ);
        
        adjustHeader();
    });
    
    function changeQuestion(entry) {
        $("#answer_readout").show();
        $("#main_q_en").text( $(entry).children(".q_en").text() );
        $("#main_q_vn").text( $(entry).children(".q_vn").text() );
        $("#main_a_en").text( $(entry).children(".a_en").text() );
        $("#main_a_vn").text( $(entry).children(".a_vn").text() );
        $("#bg_number").text( $(entry).children(".number").text() );
        $("#show_answer").show();
        $("#answer_readout .answer").hide();
        
        if ( $(entry).attr("class").indexOf("fave") > 0 ) {
            $("#top_readout").css("background-size", "300%");
            $("#star").css("opacity", "1");
        } else {
            $("#top_readout").css("background-size", "0%");
            $("#star").css("opacity", "0.4");
        };
        
        adjustHeader(); 
    }
    

    $("#speech_gender").val(speechGender);
    $("#speech_rate").val(speechRate);
    $("#speech_volume").val(speechVolume);
    
    changeQuestion( $(lastQ) );
    
    adjustHeader();
    
    $(function() {
        FastClick.attach(document.body);
    });
});

// utterance.voice = voices.filter(function(voice) { return voice.name == 'Alex'; })[0];
