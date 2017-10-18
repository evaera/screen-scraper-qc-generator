// Generated by CoffeeScript 1.12.4
(function() {
  var name, sections;

  sections = ["QA spreadsheet", "group affiliations", "hospital affiliations", "languages", "networks", "plans", "offices", "specialties", "random providers"];

  window.capitalize = function(str) {
    return str.substring(0, 1).toUpperCase() + str.substring(1);
  };

  window.onbeforeunload = function() {
    return "!";
  };

  function isNormalInteger(str) {
    var n = ~~Number(str);
    return String(n) === str && n >= 0;
};

  window.app = new Vue({
    el: '#app',
    data: {
      sections: (function() {
        var j, len, results;
        results = [];
        for (j = 0, len = sections.length; j < len; j++) {
          name = sections[j];
          results.push({
            name: name,
            issues: [
              {
                pks: "",
                issue: ""
              }
            ],
            enabled: false
          });
        }
        return results;
      })(),
      numProviders: "",
      spotCheck: false,
      copyButtonText: "Copy to Clipboard",
      darkmode: localStorage.darkmode === '1' ? true || false : void 0,
      searches: [
        {
          _id: 0,
          custom: false,
          customText: "No search criteria.",
          criteria: [
            {
              k: "",
              v: ""
            }
          ],
          missing: [
            {
              name: "",
              address: ""
            }
          ]
        }
      ]
    },
    methods: {
      newIssue: function(section) {
        var index, issue, ref, results;
        if (section.issues[section.issues.length - 1].issue !== "") {
          section.issues.push({
            pks: "",
            issue: ""
          });
        }
        ref = section.issues;
        results = [];
        for (index in ref) {
          issue = ref[index];
          if (issue.issue === "^") {
            if (section.issues[index - 1] != null) {
              if (isNormalInteger(section.issues[index - 1].issue)) {
                results.push(issue.issue = section.issues[index - 1].issue);
              } else {
                results.push(issue.issue = section.issues[index - 1].pks);
              }
            } else {
              results.push(void 0);
            }
          } else {
            results.push(void 0);
          }
        }
        return results;
      },
      newSearch: function() {
        if (this.searches[this.searches.length - 1].criteria[0].k !== "" || this.searches[this.searches.length - 1].custom === true) {
          return this.searches.push({
            _id: this.searches.length,
            custom: false,
            customText: "No search criteria.",
            criteria: [
              {
                k: "",
                v: ""
              }
            ],
            missing: [
              {
                name: "",
                address: ""
              }
            ]
          });
        }
      },
      newCriteria: function(search) {
        if (search.criteria[search.criteria.length - 1].v !== "") {
          return search.criteria.push({
            k: "",
            v: ""
          });
        }
      },
      newMissingProvider: function(search) {
        if (search.missing[search.missing.length - 1].name !== "") {
          return search.missing.push({
            name: "",
            address: ""
          });
        }
      },
      switchDarkmode: function() {
        app.darkmode = !app.darkmode;
        return localStorage.darkmode = app.darkmode ? '1' : '0';
      },
      copyButton: function() {
        app.copyButtonText = "Copied!";
        return setTimeout(function() {
          return app.copyButtonText = "Copy to Clipboard";
        }, 2000);
      }
    },
    computed: {
      output: function() {
        var criteria, getPks, hasErrors, i, issue, issues, j, k, l, len, len1, len2, len3, m, missing, numIssues, out, ref, ref1, ref2, ref3, ref4, search, section, skipPks;
        hasErrors = false;
        out = "";
        ref = this.sections;
        for (j = 0, len = ref.length; j < len; j++) {
          section = ref[j];
          if (section.enabled === false) {
            continue;
          }
          issues = "";
          skipPks = {};
          getPks = function(checkIssue) {
            var i, issue, pks, ref1;
            pks = [checkIssue.pks];
            ref1 = section.issues;
            for (i in ref1) {
              issue = ref1[i];
              if (issue.issue === checkIssue.pks) {
                pks.push(issue.pks);
                skipPks[issue.pks] = true;
              }
            }
            return pks.join(", ");
          };
          numIssues = 0;
          ref1 = section.issues;
          for (i in ref1) {
            issue = ref1[i];
            if (issue.issue !== "" && (skipPks[issue.pks] == null)) {
              numIssues++;
              hasErrors = true;
              issues += "-" + (issue.pks.length === 0 ? "" : "pk " + (getPks(issue)) + ":") + (" " + issue.issue + "\n\n");
            }
          }
          out += ("Checked " + section.name + ", ") + (issues.length > 0 ? "issue" + (numIssues !== 1 ? "s" : "") + " found:" : "no issues found.") + "\n\n";
          out += issues;
        }
        out += (this.numProviders.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || 0) + " providers found this run.\n\n";
        ref2 = this.searches;
        for (k = 0, len1 = ref2.length; k < len1; k++) {
          search = ref2[k];
          if (search.criteria[0].k === "" && search.custom === false) {
            continue;
          }
          if (search.custom) {
            out += search.customText + "\n";
          } else {
            out += "Search Criteria:\n";
            ref3 = search.criteria;
            for (l = 0, len2 = ref3.length; l < len2; l++) {
              criteria = ref3[l];
              if (criteria.k === "") {
                continue;
              }
              out += criteria.k + ": " + criteria.v + "\n";
            }
          }
          out += "\n";
          if (search.missing[0].name === "") {
            out += "No missing providers found.\n\n";
          } else {
            hasErrors = true;
            out += "Missing providers:\n\n";
            ref4 = search.missing;
            for (m = 0, len3 = ref4.length; m < len3; m++) {
              missing = ref4[m];
              if (missing.name === "") {
                continue;
              }
              out += "Name: " + missing.name + "\nAddress: " + missing.address + "\n\n";
            }
          }
          out += "\n";
        }
        if (!hasErrors) {
          out += "Ready for client approval.";
        }
        return out;
      }
    }
  });

  new Clipboard('.copy-button');

}).call(this);
