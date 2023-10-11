import React, { useState, useEffect } from "react";
import axios from "axios";

const AllShopsData = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [shopsData, setShopsData] = useState([]);

  useEffect(() => {
    const fetchShopsData = async () => {
      setIsLoading(true);
      const shopsParams = {
        page: 1,
        limit: 100000,
      };

      try {
        const response = await axios.post("admin/shop/get/all", shopsParams);
        if (response.status === 200) {
          setShopsData(response?.data?.data?.shop_data);
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchShopsData();
  }, []);

  return [shopsData, isLoading];
};

export default AllShopsData;
