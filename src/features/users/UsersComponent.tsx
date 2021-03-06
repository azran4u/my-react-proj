import React, { useEffect, useState } from "react";
import { Button, Spinner, Table, ToggleButton } from "react-bootstrap";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { fetchUsersAsync, selectUsers } from "./usersSlice";

import "./users.css";

export const UsersComponent: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchUsersAsync());
  }, [dispatch]);

  const { users, loading, error } = useAppSelector(selectUsers);

  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | undefined>(
    undefined
  );

  const refreshData = () => {
    dispatch(fetchUsersAsync());
  };

  const onClickRefreshData = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    refreshData();
  };

  useEffect(() => {
    if (autoRefreshEnabled) {
      setIntervalId(
        setInterval(() => {
          refreshData();
        }, 1000)
      );
    } else {
      if (intervalId) {
        clearInterval(intervalId);
      }
    }
  }, [autoRefreshEnabled]);

  const onClickAutoRefreshData = (
    e: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    setAutoRefreshEnabled(!autoRefreshEnabled);
  };

  const showSpinner = loading && !autoRefreshEnabled;

  if (error) {
    return <div>{error}</div>;
  } else {
    return (
      <div>
        {showSpinner && (
          <div className="container_horizontal">
            <Spinner
              animation="border"
              role="status"
              className="spinner item_horizontal"
            >
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        )}
        {users && (
          <div>
            <div className="buttons_container">
              <Button
                variant="outline-primary"
                className="button"
                onClick={onClickRefreshData}
              >
                Refresh Data
              </Button>
              <ToggleButton
                className="mb-2 button"
                id="toggle-check"
                type="checkbox"
                variant="outline-primary"
                checked={autoRefreshEnabled}
                value="1"
                onChange={(e) => setAutoRefreshEnabled(e.currentTarget.checked)}
              >
                Auto Refresh
              </ToggleButton>
            </div>
            <div className="table_container">
              <Table striped bordered hover responsive className="table">
                <thead>
                  <tr>
                    <th>Id</th>
                    <th>Name</th>
                    <th>Age</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.age}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        )}
      </div>
    );
  }
};
