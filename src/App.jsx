import React, { useState, useEffect, useRef } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import * as XLSX from "xlsx";

import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Doughnut } from "react-chartjs-2";
import { Pie } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { Bar } from "react-chartjs-2";

import { Line } from "react-chartjs-2";
import { Toolbar } from "primereact/toolbar";
import { InputTextarea } from "primereact/inputtextarea";
import { RadioButton } from "primereact/radiobutton";
import { InputNumber } from "primereact/inputnumber";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";

import "./App.css";

export default function App() {
  const nullStudent = {
    id: 0,
    RollNo: null,
    Name: "",
    Class: null,
    Gender: "Male",
    DOB: "Date of Birth",
    Pincode: null,
    Maths: null,
    Science: null,
    English: null,
    Geography: null,
  };
  const [classOptions] = useState([
    { label: "Class 1", value: 1 },
    { label: "Class 2", value: 2 },
    { label: "Class 3", value: 3 },
    { label: "Class 4", value: 4 },
    { label: "Class 5", value: 5 },
    { label: "Class 6", value: 6 },
    { label: "Class 7", value: 7 },
    { label: "Class 8", value: 8 },
    { label: "Class 9", value: 9 },
    { label: "Class 10", value: 10 },
  ]);
  const [students, setStudents] = useState([
    {
      id: 1,
      RollNo: "10",
      Name: "Lakshmi",
      Class: 8,
      Gender: "Female",
      DOB: "10/15/2014",
      Pincode: "5673",
      Maths: 65,
      Science: 67,
      English: 24,
      Geography: 89,
    },
    {
      id: 2,
      RollNo: "11",
      Name: "Ayush",
      Class: 9,
      Gender: "Male",
      DOB: "10/31/2017",
      Pincode: "9870",
      Maths: 72,
      Science: 78,
      English: 61,
      Geography: 90,
    },
  ]);
  const currentDate = new Date();
  const [studentDialog, setStudentDialog] = useState(false);
  const [delStudDialog, setDeleteStudentDialog] = useState(false);
  const [delStudsDialog, setDeleteStudentsDialog] = useState(false);
  const [student, setStudent] = useState(nullStudent);
  const [selStudents, setSelectedStudents] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);
  const [passCount, setPassCount] = useState(0);
  const [failCount, setFailCount] = useState(0);
  const handleFileUpload = (event) => {
    const file = event.files[0];

    if (file) {
      const reader = new FileReader();
      reader.readAsBinaryString(file);
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const parsedData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        const [header, ...dataRows] = parsedData;

        const nextId =
          students.length > 0
            ? Math.max(...students.map((student) => student.id)) + 1
            : 1;

        const importedStudents = dataRows.map((rowData, index) => {
          const newStudent = {};
          header.forEach((field, columnIndex) => {
            newStudent[field] = rowData[columnIndex];
          });

          newStudent.id = nextId + index;

          return newStudent;
        });

        setStudents([...students, ...importedStudents]);
      };
    }
    toast.current.show({
      severity: "info",

      summary: "File Imported",

      life: 5000,
    });
  };

  const openNew = () => {
    setStudent(nullStudent);
    setSubmitted(false);
    setStudentDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setStudentDialog(false);
  };

  const hideDeleteStudentDialog = () => {
    setDeleteStudentDialog(false);
  };

  const hideDelStudsDialog = () => {
    setDeleteStudentsDialog(false);
  };

  const savStud = () => {
    setSubmitted(true);

    if (student.Name.trim() && student.RollNo) {
      let _students = [...students];
      let _student = { ...student };

      if (student.id) {
        const index = findIndexById(student.id);

        _students[index] = _student;
        toast.current.show({
          severity: "warn",
          icon: "pi pi-check",
          summary: "Student Updated",

          life: 3000,
        });
        console.log(_student, _students);
      } else {
        _student.id = students.length + 1;
        _students.push(_student);
        toast.current.show({
          severity: "success",
          summary: "Student Created",

          life: 3000,
        });
        console.log(_student, _students);
      }

      setStudents(_students);
      setStudentDialog(false);
      setStudent(nullStudent);
    }
  };

  const editStud = (student) => {
    setStudent({ ...student });
    setStudentDialog(true);
  };

  const confirmDeleteStud = (student) => {
    setStudent(student);
    setDeleteStudentDialog(true);
  };

  const delStud = () => {
    let _students = students.filter((val) => val.id !== student.id);

    setStudents(_students);
    setDeleteStudentDialog(false);
    setStudent(nullStudent);
    toast.current.show({
      severity: "error",
      icon: "pi pi-trash",
      summary: "Student Deleted",

      life: 3000,
    });
  };

  const findIndexById = (id) => {
    let index = -1;

    for (let i = 0; i < students.length; i++) {
      if (students[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const exportCSV = () => {
    dt.current.exportCSV();
    toast.current.show({
      severity: "info",

      summary: "Excel Exported",

      life: 3000,
    });
  };

  const confirmDeleteSelected = () => {
    setDeleteStudentsDialog(true);
  };

  const delSelStuds = () => {
    let _students = students.filter((val) => !selStudents.includes(val));

    setStudents(_students);
    setDeleteStudentsDialog(false);
    setSelectedStudents(null);
    toast.current.show({
      severity: "error",
      summary: "Students Deleted",
      icon: "pi pi-trash",

      life: 3000,
    });
  };

  const onCategoryChange = (e) => {
    let _student = { ...student };

    _student["Gender"] = e.value;
    setStudent(_student);
  };

  const onInputChange = (e, Name) => {
    const val = (e.target && e.target.value) || "";
    let _student = { ...student };

    _student[`${Name}`] = val;

    setStudent(_student);
  };

  const handleDOB = (e) => {
    let _student = { ...student };

    _student["DOB"] = e.value.toLocaleDateString();

    setStudent(_student);
  };

  const onInputNumberChange = (e, Name) => {
    const val = e.value || 0;
    let _student = { ...student };

    _student[`${Name}`] = val;

    setStudent(_student);
  };
  const getColumnStyle = (rowData, subject) => {
    const marks = rowData[subject];

    let style = {};

    if (marks <= 35) {
      style = { color: "red" };
    } else if (marks >= 35 && marks < 70) {
      style = { color: "orange" };
    } else {
      style = { color: "green" };
    }

    style.fontWeight = "bold";

    return style;
  };
  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button
          label="New Student"
          icon="pi pi-user"
          severity="success"
          onClick={openNew}
        />
        <Button
          label="Delete Selected"
          icon="pi pi-trash"
          severity="danger"
          onClick={confirmDeleteSelected}
          disabled={!selStudents || !selStudents.length}
        />
      </div>
    );
  };

  const rightToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button
          label="Export to Excel"
          icon="pi pi-file-excel"
          className="p-button-help"
          onClick={exportCSV}
        />
        <FileUpload
          mode="basic"
          accept=".xlsx, .xls"
          icon="pi pi-upload"
          onSelect={handleFileUpload}
          className="p-button-success"
          chooseLabel="Import from Excel"
          auto
        />
      </div>
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-pencil"
          rounded
          outlined
          className="mr-2"
          onClick={() => editStud(rowData)}
        />
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger"
          onClick={() => confirmDeleteStud(rowData)}
        />
      </React.Fragment>
    );
  };

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="m-0">Manage Students</h4>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          onInput={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search..."
        />
      </span>
    </div>
  );
  const studDiagFooter = (
    <React.Fragment>
      <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
      <Button label="Save" icon="pi pi-check" onClick={savStud} />
    </React.Fragment>
  );
  const delStudFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={hideDeleteStudentDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={delStud}
      />
    </React.Fragment>
  );
  const deleteStudentsDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={hideDelStudsDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={delSelStuds}
      />
    </React.Fragment>
  );

  // ------------graphs-------------

  const [chartDialogVisible, setChartDialogVisible] = useState(false);
  const openChartDialog = () => {
    setChartDialogVisible(true);
    openGraph();
  };

  const closeChartDialog = () => {
    setChartDialogVisible(false);
  };

  const [passFailPie, setpassFailPie] = useState({
    labels: ["Pass", "Fail"],
    datasets: [
      {
        label: "Pass/Fail Distribution",
        backgroundColor: ["#337357", "#EE4266"],

        borderWidth: 1,
        data: [0, 0],
      },
    ],
  });

  const genderDistribution = (studentsArray) => {
    setpassFailPie((prevGraph) => ({
      ...prevGraph,
      datasets: [
        {
          ...prevGraph.datasets[0],
          data: [passCount, failCount],
        },
      ],
    }));
  };
  const getClassDistributionData = (studentsArray) => {
    const classDistribution = Array(classOptions.length).fill(0);

    studentsArray.forEach((student) => {
      const classIndex = student.Class - 1;
      classDistribution[classIndex]++;
    });

    return classDistribution;
  };

  const [classDistributionGraph, setClassDistributionGraph] = useState({
    labels: classOptions.map((option) => option.label),
    datasets: [
      {
        label: "Class Distribution",
        backgroundColor: "#124076",
        borderWidth: 1,
        data: getClassDistributionData(students),
      },
    ],
  });

  const openGraph = () => {
    genderDistribution(students);
    updateClassDistributionGraph(students);
  };

  const updateClassDistributionGraph = (studentsArray) => {
    setClassDistributionGraph((prevGraph) => ({
      ...prevGraph,
      datasets: [
        {
          ...prevGraph.datasets[0],
          data: getClassDistributionData(studentsArray),
        },
      ],
    }));
  };
  const [subjectPerformanceData, setSubjectPerformanceData] = useState(null);
  const subjectColors = ["#5E1675", "#EE4266", "#FFD23F", "#337357"];

  useEffect(() => {
    if (students && students.length > 0) {
      const subjects = ["Maths", "Science", "English", "Geography"];
      const labels = students.map((student) => student.Name);

      const datasets = subjects.map((subject, index) => ({
        label: subject,
        data: students.map((student) => student[subject]),
        backgroundColor: subjectColors[index],

        borderWidth: 0.7,
      }));
      setSubjectPerformanceData({
        labels,
        datasets,
      });
    }

    const updatePassFailCounts = () => {
      const passFailData = students.map((student) => {
        const { passed } = isPass(student);
        return { passed };
      });

      const passCount = passFailData.filter((data) => data.passed).length;
      const failCount = passFailData.filter((data) => !data.passed).length;

      setPassCount(passCount);
      setFailCount(failCount);
    };

    updatePassFailCounts();
  }, [students]);

  // ------------graphs-------------

  const [passFailReportVisible, setPassFailReportVisible] = useState(false);
  const [passFailData, setPassFailData] = useState([]); // Array to store pass/fail
  const isPass = (student) => {
    const totalMarks =
      student.Maths + student.Science + student.English + student.Geography;
    const percentage = (totalMarks / 4).toFixed(2);
    const passed =
      totalMarks >= 130 &&
      student.Maths > 35 &&
      student.Science > 35 &&
      student.English > 35 &&
      student.Geography > 35;
    return { totalMarks, passed, percentage };
  };
  const openReportDialog = () => {
    // const passFailData = students.map((student) => {
    //   const { totalMarks, passed, percentage } = isPass(student);
    //   return { ...student, totalMarks, passed, percentage };
    // });
    const passFailData = students.map((student) => {
      const { totalMarks, passed, percentage } = isPass(student);
      return { ...student, passed, totalMarks, percentage };
    });
    setPassFailData(passFailData);
    setPassFailReportVisible(true);
  };

  const passFailColumnBody = (rowData) => {
    return rowData.passed ? (
      <span className="p-tag p-tag-success">Pass</span>
    ) : (
      <span className="p-tag p-tag-danger">Fail</span>
    );
  };

  //--------Report card----------

  return (
    <>
      <Toast ref={toast} position="top-right" />
      <h1 className="text-white	text-3xl	 	">Student Management WebApp</h1>
      <Toolbar
        className="mb-4"
        left={leftToolbarTemplate}
        right={rightToolbarTemplate}
      ></Toolbar>
      <DataTable
        ref={dt}
        value={students}
        selection={selStudents}
        onSelectionChange={(e) => setSelectedStudents(e.value)}
        dataKey="id"
        paginator
        rows={7}
        rowsPerPageOptions={[7, 5, 10, 25]}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} students"
        globalFilter={globalFilter}
        header={header}
      >
        <Column selectionMode="multiple" exportable={false}></Column>
        {/* <Column field="id" header="Key" /> */}
        <Column field="RollNo" header="RollNo" />
        <Column field="Name" header="Name" />
        <Column field="Class" header="Class" />
        <Column field="Gender" header="Gender" />
        <Column field="DOB" header="DOB" />
        <Column field="Pincode" header="Pincode" />
        <Column
          field="Maths"
          header="Maths"
          body={(rowData) => (
            <span style={getColumnStyle(rowData, "Maths")}>
              {rowData.Maths}
            </span>
          )}
        />
        <Column
          field="Science"
          header="Science"
          body={(rowData) => (
            <span style={getColumnStyle(rowData, "Science")}>
              {rowData.Science}
            </span>
          )}
        />
        <Column
          field="English"
          header="English"
          body={(rowData) => (
            <span style={getColumnStyle(rowData, "English")}>
              {rowData.English}
            </span>
          )}
        />
        <Column
          field="Geography"
          header="Geography"
          body={(rowData) => (
            <span style={getColumnStyle(rowData, "Geography")}>
              {rowData.Geography}
            </span>
          )}
        />
        <Column
          body={actionBodyTemplate}
          style={{ minWidth: "6rem", textAlign: "center" }}
        />
      </DataTable>
      <br />
      <div className=" p-buttonset flex flex-wrap justify-content-center">
        <Button
          label="Open Report"
          icon="pi pi-chart-bar"
          size="large"
          className="bg-red-400	"
          severity="secondary"
          rounded
          onClick={openChartDialog}
        />
        <Button
          label="Check Result"
          icon="pi pi-book "
          className="bg-red-400	"
          severity="secondary"
          size="large"
          rounded
          onClick={openReportDialog}
        />
        {/* <Button label="Secondary" severity="secondary" rounded /> */}
      </div>
      <div className="bottom text-white	">@AmanPrakash</div>

      <Dialog
        visible={studentDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Student Details"
        modal
        className="p-fluid"
        footer={studDiagFooter}
        onHide={hideDialog}
      >
        <div className="field col">
          {/* <div className="field col">
            <label htmlFor="id" className="font-bold">
              Key Id
            </label>
            <InputNumber id="id" value={student.id} disabled />
          </div> */}

          <label htmlFor="Name" className="font-bold">
            Name
          </label>
          <InputText
            id="Name"
            value={student.Name}
            onChange={(e) => onInputChange(e, "Name")}
            required
            autoFocus
            className={classNames({ "p-invalid": submitted && !student.Name })}
          />
          {submitted && !student.Name && (
            <small className="p-error">Name is required.</small>
          )}
        </div>
        <div className="field col">
          <label htmlFor="RollNo" className="font-bold">
            RollNo
          </label>
          <InputNumber
            id="RollNo"
            value={student.RollNo}
            onValueChange={(e) => onInputNumberChange(e, "RollNo")}
            useGrouping={false}
            className={classNames({
              "p-invalid": submitted && !student.RollNo,
            })}
          />
          {submitted && !student.RollNo && (
            <small className="p-error">RollNo is required.</small>
          )}
        </div>

        <div className="field col">
          <label className="mb-3 font-bold">Gender</label>
          <div className="formgrid grid">
            <div className="field-radiobutton col-6">
              <RadioButton
                inputId="Gender1"
                name="Gender"
                value="Female"
                onChange={onCategoryChange}
                checked={student.Gender === "Female"}
              />
              <label htmlFor="category1">Female</label>
            </div>
            <div className="field-radiobutton col-6">
              <RadioButton
                inputId="Gender2"
                name="Gender"
                value="Male"
                onChange={onCategoryChange}
                checked={student.Gender === "Male"}
              />
              <label htmlFor="category2">Male</label>
            </div>
          </div>
        </div>

        <div className="field col">
          <label htmlFor="Class" className="font-bold">
            Class
          </label>
          {/* <InputNumber
            id="Class"
            value={student.Class}
            onValueChange={(e) => onInputNumberChange(e, "Class")}
            mode="decimal"
            showButtons
            min={1}
            max={10}
          /> */}
          <Dropdown
            id="Class"
            value={student.Class}
            options={classOptions}
            onChange={(e) => onInputNumberChange({ value: e.value }, "Class")}
            placeholder="Select Class"
          />
        </div>
        <div className="field col">
          <label htmlFor="Pincode" className="font-bold">
            Pincode
          </label>
          <InputNumber
            id="Pincode"
            value={student.Pincode}
            onValueChange={(e) => onInputNumberChange(e, "Pincode")}
            useGrouping={false}
            min={1000}
            max={9999}
            maxLength={4}
          />
        </div>
        <div className="field col ">
          <label htmlFor="DOB" className="font-bold">
            DOB
          </label>
          <div
            className="field col "
            id="db"
            style={{ display: "flex", alignItems: "center" }}
          >
            <InputText
              id="DOB"
              value={student.DOB}
              onChange={(e) => handleDOB(e)}
              disabled
            ></InputText>

            <Calendar
              className="col"
              id="DOB"
              value={student.DOB}
              maxDate={currentDate}
              onChange={(e) => handleDOB(e)}
              showIcon="true"
              readOnlyInput
              // inputStyle={{ display: "none" }}
            />
          </div>
        </div>
        <div className="formgrid grid col">
          <div className="field col">
            <label htmlFor="Maths" className="font-bold">
              Maths
            </label>
            <InputNumber
              id="Maths"
              value={student.Maths}
              onValueChange={(e) => onInputNumberChange(e, "Maths")}
              mode="decimal"
              showButtons
              min={0}
              max={100}
            />
          </div>
          <div className="field col">
            <label htmlFor="Science" className="font-bold">
              Science
            </label>
            <InputNumber
              id="Science"
              value={student.Science}
              onValueChange={(e) => onInputNumberChange(e, "Science")}
              mode="decimal"
              showButtons
              min={0}
              max={100}
            />
          </div>
          <div className="field col">
            <label htmlFor="English" className="font-bold">
              English
            </label>
            <InputNumber
              id="English"
              value={student.English}
              onValueChange={(e) => onInputNumberChange(e, "English")}
              mode="decimal"
              showButtons
              min={0}
              max={100}
            />
          </div>
          <div className="field col">
            <label htmlFor="Geography" className="font-bold">
              Geography
            </label>
            <InputNumber
              id="Geography"
              value={student.Geography}
              onValueChange={(e) => onInputNumberChange(e, "Geography")}
              mode="decimal"
              showButtons
              min={0}
              max={100}
            />
          </div>
        </div>
      </Dialog>
      <Dialog
        visible={delStudDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={delStudFooter}
        onHide={hideDeleteStudentDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {student && (
            <span>
              Are you sure you want to delete <b>{student.Name}</b>?
            </span>
          )}
        </div>
      </Dialog>
      <Dialog
        visible={delStudsDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={deleteStudentsDialogFooter}
        onHide={hideDelStudsDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {student && (
            <span>Are you sure you want to delete the selected students?</span>
          )}
        </div>
      </Dialog>

      <Dialog
        visible={passFailReportVisible}
        style={{ width: "50vw" }}
        header="Pass/Fail Report"
        modal
        onHide={() => setPassFailReportVisible(false)}
      >
        <div>
          <DataTable value={passFailData}>
            <Column field="RollNo" header="Roll No" />
            <Column field="Name" header="Name" />
            <Column field="Class" header="Class" />
            <Column field="totalMarks" header="Total Marks" />
            <Column
              field="percentage"
              header="Percentage"
              body={(rowData) => `${rowData.percentage} %`}
            />
            <Column
              field="passed"
              header="Pass/Fail"
              body={passFailColumnBody}
            />
          </DataTable>
          <p>
            Pass Count: <strong>{passCount}</strong>
          </p>
          <p>
            Fail Count: <strong>{failCount}</strong>
          </p>
        </div>
      </Dialog>
      <Dialog
        visible={chartDialogVisible}
        style={{ width: "90vw" }}
        header="Distribution Charts"
        modal
        onHide={closeChartDialog}
      >
        <div className="grid">
          <div className="col-3 ml-8">
            {/* <h3>Pie</h3> */}
            <Pie data={passFailPie} />
          </div>
          <div className="col">
            <h3>Class wise Distribution of students</h3>

            <Bar
              data={classDistributionGraph}
              options={{
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
          <div className="col">
            <h3>Subject wise Performance</h3>

            {subjectPerformanceData && (
              <Bar
                data={subjectPerformanceData}
                options={{
                  scales: {
                    x: {
                      stacked: true,
                    },
                    y: {
                      stacked: true,
                    },
                  },
                }}
              />
            )}
          </div>
        </div>
      </Dialog>
    </>
  );
}
