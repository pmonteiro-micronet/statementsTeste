"use client"
import React, { useState, useEffect } from "react";
import axios from 'axios';

export default function departmentInsert() {

     //inserção na tabela client preference
    const [departments, setDepartments] = useState({
        Abreviature: '',
        Description: '',
        Order: ''
    })

    const handleInputDepartments = (event) => {
        setDepartments({ ...departments, [event.target.name]: event.target.value })
    }
    function handleSubmitDepartments(event) {
        event.preventDefault()
        if (!departments.Abreviature || !departments.Description || !departments.Order) {
            alert("Preencha os campos corretamente");
            return;
        }
        axios.put('/api/v1/financialSetup/departments', {
            data: {
                Abreviature: departments.Abreviature,
                Description: departments.Description,
                Order: departments.Order,
            }
        })
            .then(response => console.log(response))
            .catch(err => console.log(err))
    }
    return { 
        handleInputDepartments, handleSubmitDepartments
    };
}

export function departmentEdit(idDepartment) {
    //edição na tabela client preference
    const [department, setValuesDepartment] = useState({
        id: idDepartment,
        Abreviature: '',
        Description: '',
        Order: ''
    })

    useEffect(() => {
        axios.get("/api/v1/financialSetup/departments/" + idDepartment)
            .then(res => {
                setValuesDepartment({ ...department, Abreviature: res.data.response.departmentName, Description: res.data.response.description, Order: res.data.response.showFo })
            })
            .catch(err => console.log(err))
    }, [])

    function handleUpdateDepartments(e) {
        e.preventDefault()
        axios.patch(`/api/v1/financialSetup/departments/` + idDepartment, {
            data: {
                Abreviature: department.Abreviature,
                Description: department.Description,
                Order: department.Order,
            }
        })
            .catch(err => console.log(err))
    }

    return { 
        handleUpdateDepartments, setValuesDepartment, department 
    };
}