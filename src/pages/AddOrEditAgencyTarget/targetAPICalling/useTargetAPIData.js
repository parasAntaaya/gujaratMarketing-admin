import { useEffect, useState } from "react";
import axios from "axios";

// sales man API calling -------------------------------------------------------------------------------------------
export const useSalesmanData = () => {
  const [salesmanData, setSalesmanData] = useState([]);

  useEffect(() => {
    const apiUrl = "/admin/user/get/all";
    const params = {
      page: 1,
      limit: 1000,
      roleFilter: "salesman",
    };

    axios
      .post(apiUrl, {
        params: params,
      })
      .then((response) => {
        if (response.status === 200) {
          setSalesmanData(response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching salesman data:", error);
      });
  }, []);

  return salesmanData;
};

// shop API calling -------------------------------------------------------------------------------------------
export const useShopData = () => {
  const [shopData, setShopData] = useState([]);

  useEffect(() => {
    const apiUrl = "/admin/shop/get/all";
    const params = {
      page: 1,
      limit: 1000,
    };

    axios
      .post(apiUrl, {
        params: params,
      })
      .then((response) => {
        if (response.status === 200) {
          setShopData(response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching shop data:", error);
      });
  }, []);

  return shopData;
};

// agency API calling -------------------------------------------------------------------------------------------
export const useAgencyData = () => {
  const [agencyData, setAgencyData] = useState([]);

  useEffect(() => {
    const apiUrl = "/admin/agency/get/all";
    const params = {
      page: 1,
      limit: 1000,
    };

    axios
      .post(apiUrl, {
        params: params,
      })
      .then((response) => {
        if (response.status === 200) {
          setAgencyData(response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching agency data:", error);
      });
  }, []);

  return agencyData;
};
// show all targets API calling -------------------------------------------------------------------------------------------
export const useAllTargetsData = () => {
  const [allTargetsData, setAllTargetsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const apiUrl = "/admin/agency/targets";
    const params = {
      page: 1,
      limit: 1000,
    };

    axios
      .post(apiUrl, {
        params: params,
      })
      .then((response) => {
        if (response.status === 200) {
          setIsLoading(false);
          setAllTargetsData(response.data);
        }
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("Error fetching all targets data:", error);
      });
  }, []);

  return allTargetsData;
};
