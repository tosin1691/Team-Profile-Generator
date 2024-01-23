const Manager = require("./lib/Manager.js");
const Engineer = require("./lib/Engineer.js");
const Intern = require("./lib/Intern.js");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./src/page-template.js");


// TODO: Write Code to gather information about the development team members, and render the HTML file.

const newTeamMember = []

const managerQuestions = [
    {
        type: "input",
        name: "name",
        message: "What is the manager's name?"

    },
    {
        type: "input",
        name: "id",
        message: "What is the manager's employee ID",
        validate: (value) =>{
            if(isNaN(value)){
                return "Please enter a valid number"
            } 
            return true
        }
    }, 
    {
        type: "input",
        name: "email",
        message: "Enter the manager's email"
    },
    {
        type: "input",
        name: "officeNumber",
        message: "Enter the manager's office number",
        validate: (value) => {
            const validPhoneNumber = value.match(/^(\+{0,})(\d{0,})([(]{1}\d{1,3}[)]{0,}){0,}(\s?\d+|\+\d{2,3}\s{1}\d+|\d+){1}[\s|-]?\d+([\s|-]?\d+){1,2}(\s){0,}$/gm)
            if(!validPhoneNumber){
                return "Please enter a valid phone number"
            }
            return true
        }
    },
    {
        type: "list",
        name: "addATeamMember",
        message: "How do you wish to proceed?",
        choices: ["Add a team member", "Finish building the team"]
    }

];

const addATeamMemberQuestions = [
    {
        type: "list",
        name: "employeeRole",
        message: "Enter role",
        choices: ["Engineer", "Intern"]
    }, 
    {
        type: "input",
        name: "employeeName",
        message: (answer) => `Enter the name of the ${answer.employeeRole}`

    },
    {
        type: "input",
        name: "employeeId",
        message: (answer) => `Enter the employee ID of the ${answer.employeeRole}`,
        validate: (value) =>{
            if(isNaN(value)){
                return "Please enter a valid number"
            } 
            return true
        }
    }, 
    {
        type: "input",
        name: "employeeEmail",
        message: (answer) => `Enter the email of the ${answer.employeeRole}`
    },
    {
        type: 'input',
        name: 'github',
        message: (answer) => `Enter the GitHub username of the ${answer.employeeRole}`,
        when: (answer) => answer.employeeRole === "Engineer"

    },
    {
        type: 'input',
        name: 'school',
        message: (answer) => `Enter the name of the university attended by the ${answer.employeeRole}`,
        when: (answer) => answer.employeeRole === "Intern"

    }, 
    {
        type: 'confirm',
        name: 'addMore',
        message: 'Would you like to add more team members?',
        default: true

    }


]



const addATeamMember = async () => {

    const responseAddTM = await inquirer.prompt(addATeamMemberQuestions)

    if (responseAddTM.employeeRole === "Intern"){
        const intern = new Intern(
            responseAddTM.employeeName,
            responseAddTM.employeeId,
            responseAddTM.employeeEmail,
            responseAddTM.school
        )
        newTeamMember.push(intern)
    } else if (responseAddTM.employeeRole === "Engineer"){
        const engineer = new Engineer(
            responseAddTM.employeeName,
            responseAddTM.employeeId,
            responseAddTM.employeeEmail,
            responseAddTM.github
        )
        newTeamMember.push(engineer)
    }

    if (responseAddTM.addMore){
        addATeamMember()
    } 
    return buildTeam()


}

const init = async () => {

    const responseMQ = await inquirer.prompt(managerQuestions)
    
    const manager = new Manager(
        responseMQ.name,
        responseMQ.id,
        responseMQ.email,
        responseMQ.officeNumber
    )

    newTeamMember.push(manager)
    
    if (responseMQ.addATeamMember === "Add a team member"){
        return addATeamMember()
    } 
    return buildTeam()

}
    
const buildTeam = () => {
    fs.writeFileSync("./output/test.html", render(newTeamMember))
    }





    
    // function call to initialize program
    init();

