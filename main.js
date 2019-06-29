document.getElementById("issueInputForm").addEventListener("submit", saveIssue)

// Getter for all issues
function getIssues() {
    const issues = localStorage.getItem('issues')
    
    // Return in JSON format - if issues non-existent, create new issues array and return 
    return issues ? JSON.parse(issues) : []
}

// Getter for individual issue
function getIssue(id) {
    // Search for issue by id (for all issues, return if issue id equals id)
    return getIssues.find(issue => issue.id === id)
}

// Delete an issue
function deleteIssue(id) {
    // Filter everything that does not equal given id
    const issues = getIssues().filter(issue => issue.id !== id)
    localStorage.setItem('issues', JSON.stringify(issues))
    fetchIssues()
}


// Used for updating and displaying issues
function fetchIssues() {
    // Get issues
    const issues = getIssues()
    console.log(issues)
    const displayIssues = document.getElementById('issuesList')

    // Generate HTML to display and update
    let newDisplay = ''

    if (issues) {
        issues.forEach(element => newDisplay += createNewIssueTemplate(element));
    }

    // Update and re-display
    displayIssues.innerHTML = newDisplay

}

// Save an issue
function saveIssue(e) {
    // Get issues array
    const issues = getIssues()

    // Create an new issue
    const issue = {
        id : chance.guid(),
        description : document.getElementById('issueDescriptionInput').value || 'No Description',
        severity : document.getElementById('issueSeverityInput').value,
        assignedTo : document.getElementById('issueAssignedToInput').value || 'Unassigned',
        status : 'Open'
    }

    // ------------------------------------------------------------------------DEBUG---------------------------------------------------------------------------------
    console.log(issue)
    // ------------------------------------------------------------------------DEBUG---------------------------------------------------------------------------------

    // Save to list of issues
    issues.push(issue)
    localStorage.setItem('issues', JSON.stringify(issues))

    // Clear form input fields
    document.getElementById('issueInputForm').reset()

    // Update the documents
    fetchIssues()

    e.preventDefault()
}

// Setting an issue to status closed
function closeIssue(id) {
    // Get list of issues
    const issues = getIssues()
    console.log('issues.length: ' + issues.length)

    // Find issue with id to close
    for (var i = 0; i < issues.length; i++) {
        if (issues[i].id === id) {
            issues[i].status = "Closed"
        }
    }

    // Save to our stoage
    localStorage.setItem('issues', JSON.stringify(issues))

    // Reload
    fetchIssues()
        
}

// Creates a new issue to display on UI
function createNewIssueTemplate ({ id, status, description, severity, assignedTo }) {
    return (
        `<div class="well">
            <p><span class="label label-info">${status}</span></p>
            <h5>Issue ID: ${id}</h5>
            <h4>${description}</h4>
            <p><span class="glyphicon glyphicon-time"></span>${severity}
            <span class="glyphicon glyphicon-user"></span>${assignedTo}</p>
            <a href="#" class="btn btn-warning" onclick="closeIssue('${id}')">Close</a>
            <a href="#" class="btn btn-danger" onclick="deleteIssue('${id}')">Delete</a>
        </div>`
    )
}