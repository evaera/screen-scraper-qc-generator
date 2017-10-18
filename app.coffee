sections = [
	"QA spreadsheet"
	"group affiliations"
	"hospital affiliations"
	"languages"
	"networks"
	"plans"
	"offices"
	"specialties"
	"random providers"
]

window.capitalize = (str) -> str.substring(0, 1).toUpperCase() + str.substring(1)

window.onbeforeunload = -> "!"

`function isNormalInteger(str) {
    var n = ~~Number(str);
    return String(n) === str && n >= 0;
}`

window.app = new Vue
	el: '#app'
	data: 
		sections: ({ name: name, issues: [{ pks: "", issue: "" }], enabled: false } for name in sections)
		numProviders: ""
		spotCheck: false
		copyButtonText: "Copy to Clipboard"
		darkmode: if localStorage.darkmode == '1' then true or false
		searches: [{_id: 0, custom: false, customText: "No search criteria.", criteria:[{k:"", v:""}], missing:[{name: "", address: ""}]}]
	methods:
		newIssue: (section) ->
			if section.issues[section.issues.length-1].issue isnt ""
				section.issues.push { pks: "", issue: "" }
			for index, issue of section.issues
				if issue.issue is "^"
					if section.issues[index-1]?
						if isNormalInteger(section.issues[index-1].issue)
							issue.issue = section.issues[index-1].issue
						else
							issue.issue = section.issues[index-1].pks

		newSearch: ->
			if @searches[@searches.length-1].criteria[0].k isnt "" or @searches[@searches.length-1].custom == true
				@searches.push {_id: @searches.length, custom: false, customText: "No search criteria.", criteria:[{k:"", v:""}], missing:[{name: "", address: ""}]}
		newCriteria: (search) ->
			if search.criteria[search.criteria.length-1].v isnt ""
				search.criteria.push {k: "", v: ""}
		
		newMissingProvider: (search) ->
			if search.missing[search.missing.length-1].name isnt ""
				search.missing.push {name: "", address: ""}
		switchDarkmode: ->
			app.darkmode = !app.darkmode
			localStorage.darkmode = if app.darkmode then '1' else '0'
		copyButton: ->
			app.copyButtonText = "Copied!"
			setTimeout -> 
				app.copyButtonText = "Copy to Clipboard"
			, 2000

	computed:
		output: ->
			hasErrors = false
			out = ""
			for section in @sections
				continue if section.enabled is false
				
				issues = ""
				skipPks = {}
				
				getPks = (checkIssue) ->
					pks = [checkIssue.pks]
					for i, issue of section.issues
						if issue.issue is checkIssue.pks
							pks.push issue.pks
							skipPks[issue.pks] = true
					pks.join ", "
					
				for i, issue of section.issues
					if issue.issue isnt "" and not skipPks[issue.pks]?
						hasErrors = true
						issues += "-" + (if issue.pks.length is 0 then "" else "pk #{getPks(issue)}:") + " #{issue.issue}\n\n"
						
				out += "Checked #{section.name}, " + (if issues.length > 0 then "issues found:" else "no issues found.") + "\n\n"
				out += issues
				
			out += "#{@numProviders.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") or 0} providers found this run.\n\n"
			
			for search in @searches
				continue if search.criteria[0].k is "" and search.custom is false
				
				if search.custom
					out += search.customText + "\n"
				else
					out += "Search Criteria:\n"
					for criteria in search.criteria
						continue if criteria.k is ""
						out += "#{criteria.k}: #{criteria.v}\n"
				out += "\n"
				if search.missing[0].name is ""
					out += "No missing providers found.\n\n"
				else
					hasErrors = true
					out += "Missing providers:\n\n"
					for missing in search.missing
						continue if missing.name is ""
						out += "Name: #{missing.name}\nAddress: #{missing.address}\n\n"
				out += "\n"
			
			out += "Ready for client approval." unless hasErrors
			
			out
					
					
new Clipboard('.copy-button')