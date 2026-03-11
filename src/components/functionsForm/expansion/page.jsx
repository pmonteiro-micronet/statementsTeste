"use client"
import React, { useState, useEffect } from "react";
import axios from 'axios';

export function expansion(){

    //expanção do ecra no form
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return { toggleExpand , setIsExpanded, isExpanded };
}
