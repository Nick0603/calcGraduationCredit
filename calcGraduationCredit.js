var yourSemester = 1031;
semesters = [];
for(var i=0;i<8;i++){
	semesters.push(yourSemester);
	yourSemester++;
	if(yourSemester % 10 > 2){
		yourSemester = yourSemester + 10 - 2;
	}
}

var MEObligatoryCourse = {};
MEObligatoryCourse[semesters[0]]=["微積分（一）", "物理", "機械工程與工程倫理", "化學", "物理實習", "化學實習"];
MEObligatoryCourse[semesters[1]]=["微積分（二）", "物理", "物理實習", "*程式語言", "靜力學"];
MEObligatoryCourse[semesters[2]]=["機械實習(一)-材料與製造領域", "熱力學", "工程數學(一)", "動力學", "工程材料(一)"];
MEObligatoryCourse[semesters[3]]=["材料力學", "工程數學(二)", "應用電子學", "機動學"];
MEObligatoryCourse[semesters[4]]=["機械設計", "製造學", "機械實習(二)-電子與自控領域", "自動控制(一)", "流體力學"];
MEObligatoryCourse[semesters[5]]=["機械系統設計與實務","熱傳學","機械實習(三)-熱流領域"];

var MELearnedCourse = [];
var MENoLearnedCourse = [];

var learnedList = document.querySelectorAll("#DataGrid1 tr");

var SemesterPos = 1;
var CodePos = 2;
var NamePos = 3;
var CreditPos = 4;
var GradePos = 5;

var graduatePracticeCourseCredit = 2;
var graduateOptionalCourseCredit = 22;

for(var index = learnedList.length-1 ; index >= 0  ; index--){
	var course = learnedList[index].cells;
	var courseCode = course[CodePos].innerText;
	var courseHeadCode = courseCode.substr(0,2);
	if( courseHeadCode == "ME" || courseHeadCode == "ET" || courseHeadCode == "CE"){
		// 收集機械系課程資訊
		MELearnedCourse.push({
			semester:course[SemesterPos].innerText,
			code:courseCode,
			name:course[NamePos].innerText,
			credit:parseInt(course[CreditPos].innerText),
			grade:course[GradePos].innerText
		});
	}else{
		// 刪除機械系外的課程
		DataGrid1.deleteRow(index);
	}
}


function getAllIndexes(arr, val) {
    var indexes = [], i = -1;
    while ((i = arr.indexOf(val, i+1)) != -1){
        indexes.push(i);
    }
    return indexes;
}


//紀錄修過的課程名
var MELearnedCourseNames = [];
var MELearnedCourseStatus = [];
for(var i =0;i<MELearnedCourse.length;i++){
	MELearnedCourseNames.push(MELearnedCourse[i].name);
	MELearnedCourseStatus.push("未知");
}
var MELearnedCourseName
for(var i =0;i<semesters.length;i++){
	var semester = semesters[i];
	
	if(!MEObligatoryCourse[semester])continue;
	
	for(j =0;j<MEObligatoryCourse[semester].length;j++){
		
		var courseName = MEObligatoryCourse[semester][j];
		// 收尋必修課程 特別關鍵字功能  
		if(courseName[0] == "*"){
			courseName = courseName.substr(1,courseName.length-1);
			var courseindex = -1;
			for(var k = 0;k<MELearnedCourseNames.length;k++){
				var learnedCourseName = MELearnedCourseNames[k];
				if(learnedCourseName.includes(courseName)){
					courseindex = k;
				}
			}
		}else{
			var indexes = getAllIndexes(MELearnedCourseNames, courseName);
			if(indexes.length == 1){ 
				courseindex = indexes[0]
			}else{
				courseindex = -1;
				for(var k = 0;k<indexes.length;k++){
						if(semester == MELearnedCourse[indexes[k]].semester){
							courseindex = indexes[k];
							break;
						}
				}
			}
		}
		
		if(courseindex != -1){
			var courseGrade = MELearnedCourse[courseindex].grade;
			// 成績不及格 (D以上) 或 二次退選  皆為false
			if(courseGrade.charCodeAt(0) < "D".charCodeAt(0)){
				// 修過此課程;
				MELearnedCourseStatus[courseindex] = "必修修過";
			}else{
				// 被當此課程;
				if(courseGrade[0] == "二"){
					MELearnedCourseStatus[courseindex] = "必修二退";
				}else{
					MELearnedCourseStatus[courseindex] = "必修當掉";
				}
			}
		}else{
			// 未修過的課程
			MENoLearnedCourse.push(courseName);
		}
	}
}

for(var index =0;index<MELearnedCourseStatus.length;index++){
	var status = MELearnedCourseStatus[index];
	if(status == "未知"){
		var courseName = MELearnedCourse[index].name;
		if(courseName.includes("實習")){
			var courseCate = "實習";
		}else{
			var courseCate = "選修";
		}
		
		var courseGrade = MELearnedCourse[index].grade;
		// 成績不及格 (D以上) 或 二次退選  皆為false
		if(courseGrade.charCodeAt(0) < "D".charCodeAt(0)){
			// 修過此課程;
			MELearnedCourseStatus[index] = courseCate + "修過";
		}else{
			// 被當此課程;
			if(courseGrade[0] == "二"){
				MELearnedCourseStatus[courseindex] = courseCate + "二退";
			}else{
				MELearnedCourseStatus[courseindex] = courseCate + "當掉";
			}
		}
	}
}


console.log("------------------------------");
console.log("必修課程狀況：");
for(var i =0;i<MELearnedCourse.length;i++){
	var status = MELearnedCourseStatus[i];
	if(status == "必修當掉" || status == "必修二退"){
		var semester = MELearnedCourse[i].semester;
		var code = MELearnedCourse[i].code;
		var name = MELearnedCourse[i].name;
		var grade = MELearnedCourse[i].grade;	
		console.log(name + " " + status);
	}
}

for(var i =0;i < MENoLearnedCourse.length;i++){
	var name = MENoLearnedCourse[i];
	console.log(name + " 必修未修");
}
console.log("------------------------------");
console.log("選修與實習課程狀況：");

var practiceCourseCredit = 0;
var optionalCourseCredit = 0;
for(var i =0;i<MELearnedCourse.length;i++){
	var status = MELearnedCourseStatus[i];
	if(status.substr(0,2) == "選修" || status.substr(0,2) == "實習"){
		if(status == "選修修過"){
			var credit = MELearnedCourse[i].credit;
			optionalCourseCredit += credit;
		}else if(status == "實習修過"){
			if(practiceCourseCredit < graduatePracticeCourseCredit){
				practiceCourseCredit++;
			}else{
				optionalCourseCredit ++;
			}
		}
		var semester = MELearnedCourse[i].semester;
		var code = MELearnedCourse[i].code;
		var name = MELearnedCourse[i].name;
		var credit = MELearnedCourse[i].credit;
		var grade = MELearnedCourse[i].grade;	
		console.log(semester + " 學分:" + credit +" " + name + " (" + code + ") :" + grade);
	}
}

var graduatePracticeCourseCredit = 2;
var graduateOptionalCourseCredit = 22;
console.log("------------------------------");
console.log("選修學分完成率: " + optionalCourseCredit+"/" + graduateOptionalCourseCredit);
console.log("必修實習學分完成率: " + practiceCourseCredit+"/" + graduatePracticeCourseCredit);

