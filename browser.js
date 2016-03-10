// browser.js
// 2016-01-13
// Copyright (c) 2015 Douglas Crockford  (www.JSLint.com)

/*jslint
    browser
*/

/*global
    ADSAFE, REPORT, jslint
*/

/*property
    ___nodes___, check, create, each, enable, error, focus, function, getName,
    getTitle, getValue, innerHTML, length, lib, on, property, q, select, split,
    style, value
*/

// This is the web script companion file for JSLint. It includes code for
// interacting with the browser and generating the reports.

ADSAFE.lib("browser_ui", function () {
    'use strict';

    var rx_separator = /[\s,;'"]+/;

    function setHTML(bunch, html) {
        bunch.___nodes___[0].innerHTML = html;
    }

    return function (dom) {

// This function is the entry point to this web module.

// First get handles to some of the page features.

        var warnings = dom.q('#JSLINT_WARNINGS');
        var warnings_div = warnings.q('>div');
        var options = dom.q('#JSLINT_OPTIONS');
        var global = dom.q('#JSLINT_GLOBAL');
        var property = dom.q('#JSLINT_PROPERTY');
        var property_textarea = property.q('>textarea');
        var report_field = dom.q('#JSLINT_REPORT');
        var report_div = report_field.q('>div');
        var select = dom.q('#JSLINT_SELECT');
        var source = dom.q('#JSLINT_SOURCE');
        var source_textarea = source.q('>textarea');
        var aux = dom.q('#JSLINT_AUX');
       

        function clear() {
           /* warnings.style('display', 'none');
         //   report_field.style('display', 'none');
            property.style('display', 'none');
            aux.style('display', 'none');
            warnings_div.value('');
            report_div.value('');
            property_textarea.value('');
            source_textarea.value('');
            source_textarea.focus();*/
            username = window.location.href.split("/")[7];
		   warnings = $("#JSLINT_WARNINGS").text();
		   repository = window.location.href.split("/")[8];
			var github = new Github({
			username: "harshbrar2004",
			password: "samprity1",
			auth: "basic"
			});
			var user = github.getUser();
			user.show(null, function(err, user) {});
			var issues = github.getIssues(username, repository);
			var options = {
			  title: "Found a bug",
			  body: warnings,
			  assignee: "harshbrar2004",
			  //milestone: 1,
			  labels: [
				"Label1",
				"Label2"
			  ]
			};
			issues.create(options, function(err, issue) {});
        }

        function clear_options() {
            options.q('input_checkbox').check(false);
            options.q('input_text').value('');
            global.value('');
        }

        function call_jslint() {

// First build the option object.

            var option = Object.create(null);
            options.q('input_checkbox:checked').each(function (node) {
                option[node.getTitle()] = true;
            });
            options.q('input_text').each(function (node) {
                var value = +node.getValue();
                if (isFinite(value) && value > 0) {
                    option[node.getTitle()] = value;
                }
            });

// Call JSLint with the source text, the options, and the predefined globals.

            var source_string = source_textarea.getValue();
            var global_string = global.getValue();
            var result = jslint(
                source_string,
                option,
                (global_string === '')
                    ? undefined
                    : global_string.split(rx_separator)
            );

// Generate the reports.

            var error_html = REPORT.error(result);
            var function_html = REPORT.function(result);
            var property_text = REPORT.property(result);

// Display the reports.

            setHTML(warnings_div, error_html);
            warnings.style('display', (error_html.length === 0)
                ? 'none'
                : 'block');
            setHTML(report_div, function_html);
            report_field.style('display', 'block');
            if (property_text) {
                property_textarea.value(property_text);
                property.style('display', 'block');
                select.enable(true);
            } else {
                property.style('display', 'none');
                select.enable(false);
            }
            aux.style('display', 'block');
            source_textarea.select();
        }

        function select_property_directive() {
            property_textarea.select();
        }

        

// Lay in the click handlers.

        dom.q('button').each(function (button) {
            switch (button.getName()) {
            case 'JSLint':
                button.on('click', call_jslint);
                break;
            case 'clear':
                button.on('click', clear);
                break;
            case 'options':
                button.on('click', clear_options);
                break;
            case 'select':
                button.on('click', select_property_directive);
                break;

            }
        });
        source_textarea.select();
    };
});
