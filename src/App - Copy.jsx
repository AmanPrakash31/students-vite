import React, { useState, useEffect, useRef } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import * as XLSX from "xlsx";

import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { SampleStudents } from "./service/SampleStudents";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Doughnut } from "react-chartjs-2";
import { Pie } from "react-chartjs-2";
import Chart from "chart.js/auto";
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
    DOB: "Date",
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

  // ------------graphs-------------
  const [chartDialogVisible, setChartDialogVisible] = useState(false);
  const openChartDialog = () => {
    setChartDialogVisible(true);
  };
  const closeChartDialog = () => {
    setChartDialogVisible(false);
  };

  const labels = ["January", "February", "March", "April", "May", "June"];
  const data = {
    labels: labels,
    datasets: [
      {
        label: "My First dataset",
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(0,0,255)",
        data: [0, 10, 5, 2, 20, 30, 45],
      },
    ],
  };
  // ------------graphs-------------

  const [students, setStudents] = useState(null);
  const [studentDialog, setStudentDialog] = useState(false);
  const [delStudDialog, setDeleteStudentDialog] = useState(false);
  const [delStudsDialog, setDeleteStudentsDialog] = useState(false);
  const [student, setStudent] = useState(nullStudent);
  const [selStudents, setSelectedStudents] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);

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
  };

  useEffect(() => {
    SampleStudents.getStudents().then((data) => setStudents(data));
  }, []);

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

    if (student.Name.trim()) {
      let _students = [...students];
      let _student = { ...student };

      if (student.id) {
        const index = findIndexById(student.id);

        _students[index] = _student;
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Student Updated",
          life: 3000,
        });
      } else {
        _student.id = students.length + 1;
        _students.push(_student);
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Student Created",
          life: 3000,
        });
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
      severity: "success",
      summary: "Successful",
      detail: "Student Deleted",
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
      severity: "success",
      summary: "Successful",
      detail: "Students Deleted",
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

  const onInputNumberChange = (e, Name) => {
    const val = e.value || 0;
    let _student = { ...student };

    _student[`${Name}`] = val;

    setStudent(_student);
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

  return (
    <div>
      <Toast ref={toast} />
      <h1 className="font-bold">Student Management WebApp</h1>
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
        rows={10}
        rowsPerPageOptions={[5, 10, 25]}
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
        <Column field="Maths" header="Maths" />
        <Column field="Science" header="Science" />
        <Column field="English" header="English" />
        <Column field="Geography" header="Geography" />
        <Column
          body={actionBodyTemplate}
          style={{ minWidth: "6rem", textAlign: "center" }}
        />
      </DataTable>
      <br />
      <div className="bottom">@AmanPrakash</div>

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
          <div className="field col">
            <label htmlFor="id" className="font-bold">
              Key Id
            </label>
            <InputNumber id="id" value={student.id} disabled />
          </div>

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
            allowEmpty="false"
          />
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
        {/* <div className="field col">
          <label htmlFor="DOB" className="font-bold">
            DOB
          </label>
          <InputText
            id="DOB"
            value={student.DOB}
            onChange={(e) => onInputChange(e, "DOB")}
          /> */}
        {/* </div> */}
        <div className="field col">
          <label htmlFor="DOB" className="font-bold">
            DOB
          </label>
          <Calendar
            id="DOB"
            value={student.DOB}
            onChange={(e) =>
              setStudent({ ...student, DOB: e.value.toLocaleDateString() })
            }
            showIcon
          />
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
      <Button
        label="Open Pie Chart"
        icon="pi pi-chart-bar"
        className="p-button-info"
        onClick={openChartDialog}
      />

      <Dialog
        visible={chartDialogVisible}
        style={{ width: "50vw" }}
        header="Student Performance Pie Chart"
        modal
        onHide={closeChartDialog}
      >
        <div>
          <Pie data={data} />
        </div>
      </Dialog>
    </div>
  );
}
