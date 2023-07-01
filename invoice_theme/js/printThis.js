/*
 * printThis v2.0.0
 * @desc Printing plug-in for jQuery
 * @author Jason Day
 * @author Samuel Rouse
 *
 * Resources (based on):
 * - jPrintArea: http://plugins.jquery.com/project/jPrintArea
 * - jqPrint: https://github.com/permanenttourist/jquery.jqprint
 * - Ben Nadal: http://www.bennadel.com/blog/1591-Ask-Ben-Print-Part-Of-A-Web-Page-With-jQuery.htm
 *
 * Licensed under the MIT licence:
 *              http://www.opensource.org/licenses/mit-license.php
 *
 * (c) Jason Day 2015-2022
 *
 * Usage:
 *
 *  jQuery("#mySelector").printThis({
 *      debug: false,                   // show the iframe for debugging
 *      importCSS: true,                // import parent page css
 *      importStyle: true,              // import style tags
 *      printContainer: true,           // grab outer container as well as the contents of the selector
 *      loadCSS: "path/to/my.css",      // path to additional css file - use an array [] for multiple
 *      pageTitle: "",                  // add title to print page
 *      removeInline: false,            // remove all inline styles from print elements
 *      removeInlineSelector: "body *", // custom selectors to filter inline styles. removeInline must be true
 *      printDelay: 1000,               // variable print delay
 *      header: null,                   // prefix to html
 *      footer: null,                   // postfix to html
 *      base: false,                    // preserve the BASE tag, or accept a string for the URL
 *      formValues: true,               // preserve input/form values
 *      canvas: true,                   // copy canvas elements
 *      doctypeString: '...',           // enter a different doctype for older markup
 *      removeScripts: false,           // remove script tags from print content
 *      copyTagClasses: true            // copy classes from the html & body tag
 *      copyTagStyles: true,            // copy styles from html & body tag (for CSS Variables)
 *      beforePrintEvent: null,         // callback function for printEvent in iframe
 *      beforePrint: null,              // function called before iframe is filled
 *      afterPrint: null                // function called before iframe is removed
 *  });
 *
 * Notes:
 *  - the loadCSS will load additional CSS (with or without @media print) into the iframe, adjusting layout
 */
;


(function(jQuery) {

    function appendContent(jQueryel, content) {
        if (!content) return;

        // Simple test for a jQuery element
        jQueryel.append(content.jquery ? content.clone() : content);
    }

    function appendBody(jQuerybody, jQueryelement, opt) {
        // Clone for safety and convenience
        // Calls clone(withDataAndEvents = true) to copy form values.
        var jQuerycontent = jQueryelement.clone(opt.formValues);

        if (opt.formValues) {
            // Copy original select and textarea values to their cloned counterpart
            // Makes up for inability to clone select and textarea values with clone(true)
            copyValues(jQueryelement, jQuerycontent, 'select, textarea');
        }

        if (opt.removeScripts) {
            jQuerycontent.find('script').remove();
        }

        if (opt.printContainer) {
            // grab jQuery.selector as container
            jQuerycontent.appendTo(jQuerybody);
        } else {
            // otherwise just print interior elements of container
            jQuerycontent.each(function() {
                jQuery(this).children().appendTo(jQuerybody)
            });
        }
    }

    // Copies values from origin to clone for passed in elementSelector
    function copyValues(origin, clone, elementSelector) {
        var jQueryoriginalElements = origin.find(elementSelector);

        clone.find(elementSelector).each(function(index, item) {
            jQuery(item).val(jQueryoriginalElements.eq(index).val());
        });
    }

    var opt;
    jQuery.fn.printThis = function(options) {
        opt = jQuery.extend({}, jQuery.fn.printThis.defaults, options);
        var jQueryelement = this instanceof jQuery ? this : jQuery(this);

        var strFrameName = "printThis-" + (new Date()).getTime();

        if (window.location.hostname !== document.domain && navigator.userAgent.match(/msie/i)) {
            // Ugly IE hacks due to IE not inheriting document.domain from parent
            // checks if document.domain is set by comparing the host name against document.domain
            var iframeSrc = "javascript:document.write(\"<head><script>document.domain=\\\"" + document.domain + "\\\";</s" + "cript></head><body></body>\")";
            var printI = document.createElement('iframe');
            printI.name = "printIframe";
            printI.id = strFrameName;
            printI.className = "MSIE";
            document.body.appendChild(printI);
            printI.src = iframeSrc;

        } else {
            // other browsers inherit document.domain, and IE works if document.domain is not explicitly set
            var jQueryframe = jQuery("<iframe id='" + strFrameName + "' name='printIframe' />");
            jQueryframe.appendTo("body");
        }

        var jQueryiframe = jQuery("#" + strFrameName);

        // show frame if in debug mode
        if (!opt.debug) jQueryiframe.css({
            position: "absolute",
            width: "0px",
            height: "0px",
            left: "-600px",
            top: "-600px"
        });

        // before print callback
        if (typeof opt.beforePrint === "function") {
            opt.beforePrint();
        }

        // jQueryiframe.ready() and jQueryiframe.load were inconsistent between browsers
        setTimeout(function() {

            // Add doctype to fix the style difference between printing and render
            function setDocType(jQueryiframe, doctype){
                var win, doc;
                win = jQueryiframe.get(0);
                win = win.contentWindow || win.contentDocument || win;
                doc = win.document || win.contentDocument || win;
                doc.open();
                doc.write(doctype);
                doc.close();
            }

            if (opt.doctypeString){
                setDocType(jQueryiframe, opt.doctypeString);
            }

            var jQuerydoc = jQueryiframe.contents(),
                jQueryhead = jQuerydoc.find("head"),
                jQuerybody = jQuerydoc.find("body"),
                jQuerybase = jQuery('base'),
                baseURL;

            // add base tag to ensure elements use the parent domain
            if (opt.base === true && jQuerybase.length > 0) {
                // take the base tag from the original page
                baseURL = jQuerybase.attr('href');
            } else if (typeof opt.base === 'string') {
                // An exact base string is provided
                baseURL = opt.base;
            } else {
                // Use the page URL as the base
                baseURL = document.location.protocol + '//' + document.location.host;
            }

            jQueryhead.append('<base href="' + baseURL + '">');

            // import page stylesheets
            if (opt.importCSS) jQuery("link[rel=stylesheet]").each(function() {
                var href = jQuery(this).attr("href");
                if (href) {
                    var media = jQuery(this).attr("media") || "all";
                    jQueryhead.append("<link type='text/css' rel='stylesheet' href='" + href + "' media='" + media + "'>");
                }
            });

            // import style tags
            if (opt.importStyle) jQuery("style").each(function() {
                jQueryhead.append(this.outerHTML);
            });

            // add title of the page
            if (opt.pageTitle) jQueryhead.append("<title>" + opt.pageTitle + "</title>");

            // import additional stylesheet(s)
            if (opt.loadCSS) {
                if (jQuery.isArray(opt.loadCSS)) {
                    jQuery.each(opt.loadCSS, function(index, value) {
                        jQueryhead.append("<link type='text/css' rel='stylesheet' href='" + this + "'>");
                    });
                } else {
                    jQueryhead.append("<link type='text/css' rel='stylesheet' href='" + opt.loadCSS + "'>");
                }
            }

            var pageHtml = jQuery('html')[0];

            // CSS VAR in html tag when dynamic apply e.g.  document.documentElement.style.setProperty("--foo", bar);
            jQuerydoc.find('html').prop('style', pageHtml.style.cssText);

            // copy 'root' tag classes
            var tag = opt.copyTagClasses;
            if (tag) {
                tag = tag === true ? 'bh' : tag;
                if (tag.indexOf('b') !== -1) {
                    jQuerybody.addClass(jQuery('body')[0].className);
                }
                if (tag.indexOf('h') !== -1) {
                    jQuerydoc.find('html').addClass(pageHtml.className);
                }
            }

            // copy ':root' tag classes
            tag = opt.copyTagStyles;
            if (tag) {
                tag = tag === true ? 'bh' : tag;
                if (tag.indexOf('b') !== -1) {
                    jQuerybody.attr('style', jQuery('body')[0].style.cssText);
                }
                if (tag.indexOf('h') !== -1) {
                    jQuerydoc.find('html').attr('style', pageHtml.style.cssText);
                }
            }

            // print header
            appendContent(jQuerybody, opt.header);

            if (opt.canvas) {
                // add canvas data-ids for easy access after cloning.
                var canvasId = 0;
                // .addBack('canvas') adds the top-level element if it is a canvas.
                jQueryelement.find('canvas').addBack('canvas').each(function(){
                    jQuery(this).attr('data-printthis', canvasId++);
                });
            }

            appendBody(jQuerybody, jQueryelement, opt);

            if (opt.canvas) {
                // Re-draw new canvases by referencing the originals
                jQuerybody.find('canvas').each(function(){
                    var cid = jQuery(this).data('printthis'),
                        jQuerysrc = jQuery('[data-printthis="' + cid + '"]');

                    this.getContext('2d').drawImage(jQuerysrc[0], 0, 0);

                    // Remove the markup from the original
                    if (jQuery.isFunction(jQuery.fn.removeAttr)) {
                        jQuerysrc.removeAttr('data-printthis');
                    } else {
                        jQuery.each(jQuerysrc, function(i, el) {
                            el.removeAttribute('data-printthis');
                        });
                    }
                });
            }

            // remove inline styles
            if (opt.removeInline) {
                // Ensure there is a selector, even if it's been mistakenly removed
                var selector = opt.removeInlineSelector || '*';
                // jQuery.removeAttr available jQuery 1.7+
                if (jQuery.isFunction(jQuery.removeAttr)) {
                    jQuerybody.find(selector).removeAttr("style");
                } else {
                    jQuerybody.find(selector).attr("style", "");
                }
            }

            // print "footer"
            appendContent(jQuerybody, opt.footer);

            // attach event handler function to beforePrint event
            function attachOnBeforePrintEvent(jQueryiframe, beforePrintHandler) {
                var win = jQueryiframe.get(0);
                win = win.contentWindow || win.contentDocument || win;

                if (typeof beforePrintHandler === "function") {
                    if ('matchMedia' in win) {
                        win.matchMedia('print').addListener(function(mql) {
                            if(mql.matches)  beforePrintHandler();
                        });
                    } else {
                        win.onbeforeprint = beforePrintHandler;
                    }
                }
            }
            attachOnBeforePrintEvent(jQueryiframe, opt.beforePrintEvent);

            setTimeout(function() {
                if (jQueryiframe.hasClass("MSIE")) {
                    // check if the iframe was created with the ugly hack
                    // and perform another ugly hack out of neccessity
                    window.frames["printIframe"].focus();
                    jQueryhead.append("<script>  window.print(); </s" + "cript>");
                } else {
                    // proper method
                    if (document.queryCommandSupported("print")) {
                        jQueryiframe[0].contentWindow.document.execCommand("print", false, null);
                    } else {
                        jQueryiframe[0].contentWindow.focus();
                        jQueryiframe[0].contentWindow.print();
                    }
                }

                // remove iframe after print
                if (!opt.debug) {
                    setTimeout(function() {
                        jQueryiframe.remove();

                    }, 1000);
                }

                // after print callback
                if (typeof opt.afterPrint === "function") {
                    opt.afterPrint();
                }

            }, opt.printDelay);

        }, 333);

    };

    // defaults
    jQuery.fn.printThis.defaults = {
        debug: false,                       // show the iframe for debugging
        importCSS: true,                    // import parent page css
        importStyle: true,                  // import style tags
        printContainer: true,               // print outer container/jQuery.selector
        loadCSS: "",                        // path to additional css file - use an array [] for multiple
        pageTitle: "",                      // add title to print page
        removeInline: false,                // remove inline styles from print elements
        removeInlineSelector: "*",          // custom selectors to filter inline styles. removeInline must be true
        printDelay: 1000,                   // variable print delay
        header: null,                       // prefix to html
        footer: null,                       // postfix to html
        base: false,                        // preserve the BASE tag or accept a string for the URL
        formValues: true,                   // preserve input/form values
        canvas: true,                       // copy canvas content
        doctypeString: '<!DOCTYPE html>',   // enter a different doctype for older markup
        removeScripts: false,               // remove script tags from print content
        copyTagClasses: true,               // copy classes from the html & body tag
        copyTagStyles: true,                // copy styles from html & body tag (for CSS Variables)
        beforePrintEvent: null,             // callback function for printEvent in iframe
        beforePrint: null,                  // function called before iframe is filled
        afterPrint: null                    // function called before iframe is removed
    };
})(jQuery);
