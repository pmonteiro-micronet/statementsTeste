"use client"
import React, {useState, useEffect} from 'react'
import axios from "axios";

export default function useApi(apiUrl) {
        const [state, setState] = useState();
        const [isLoading, setIsLoading] = useState(true);
        const [error, setError] = useState(true);
        useEffect(() => {
          const getData = async () => {
            setIsLoading(true);
            const res = await axios.get(apiUrl)
            .catch((err) => setError(err));
            setState(res.data.response);
            setIsLoading(false);
          };
          getData();
        }, []);
        return {
          state, isLoading, error
        };
}

