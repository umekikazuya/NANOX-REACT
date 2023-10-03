import { StyledInputDescription, StyledInputText } from '../../../feature/UserInterface/styles/components';
import { SyncDescription } from '../api/Patch/SyncDescription';
import { SyncTitle } from '../api/Patch/SyncTitle';
import { toast } from 'react-toastify';
import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { SyncDeadline } from '../api/Patch/SyncDeadline';

interface Input {
  id: string | undefined,
  defaultValue: string | undefined,
}

export const InputTitle: React.FC<Input> = ({ id, defaultValue }) => {
  const [inputValue, setInputValue] = useState<string | undefined>(defaultValue);
  useEffect(() => {
    if (defaultValue) {
      setInputValue(defaultValue);
    }
  }, [defaultValue]);
  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(event.target.value);
    },
    []
  );
  const fetchData = useCallback(async () => {
    try {
      if (id  === undefined) return;
      if (!inputValue) return;
      await SyncTitle(inputValue, id);
    } catch (error) {
      toast.error('エラーです。');
    }
  }, [inputValue, id]);
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  return (
    <div>
      <StyledInputText
        type="text"
        value={inputValue}
        onChange={handleInputChange}
      />
    </div>
  );
}

export const InputDescription: React.FC<Input> = ({ id, defaultValue }) => {
  const [inputValue, setInputValue] = useState<string | undefined>(defaultValue);
  useEffect(() => {
    if (defaultValue) {
      setInputValue(defaultValue);
    }
  }, [defaultValue]);
  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(event.target.value);
    },
    []
  );
  const fetchData = useCallback(async () => {
    try {
      if (id === undefined) return;
      if (inputValue === undefined) return;
      await SyncDescription(inputValue, id);
    } catch (error) {
      console.error(error);
    }
  }, [inputValue, id]);
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <StyledInputDescription
      type="text"
      value={inputValue}
      onChange={handleInputChange}
    />
  );
}


export const InputDeadLine: React.FC<Input> = ({ id, defaultValue }) => {
  useEffect(() => {
    if (defaultValue) {
      setInputValue(defaultValue);
    }
  }, [defaultValue]);
  const defaultDateTime = defaultValue ? new Date(defaultValue) : undefined;
  const year = defaultDateTime ? String(defaultDateTime.getFullYear()) : undefined;
  const month = defaultDateTime ? String(defaultDateTime.getMonth() + 1).padStart(2, '0') : undefined;
  const day = defaultDateTime ? String(defaultDateTime.getDate()).padStart(2, '0') : undefined;
  const hours = defaultDateTime ? String(defaultDateTime.getHours()).padStart(2, '0') : undefined;
  const minutes = defaultDateTime ? String(defaultDateTime.getMinutes()).padStart(2, '0') : undefined;
  defaultValue = (year !== undefined && month !== undefined && day !== undefined && hours !== undefined && minutes !== undefined) ? `${year}-${month}-${day}T${hours}:${minutes}` : undefined;
  const [inputValue, setInputValue] = useState<string | undefined>(defaultValue);
  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(event.target.value);
    },
    []
  );
  const fetchData = useCallback(async () => {
    try {
      if (id !== undefined && inputValue !== undefined) {
        await SyncDeadline(inputValue, id);
      }
    } catch (error) {
      console.log('通信がミスる。');
      console.error(error);
    }
  }, [inputValue, id]);
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  return (
    <StyledInputDateTimeWrapper>
      <StyledInputDateTime
        type="datetime-local"
        value={inputValue ? inputValue : ''}
        onChange={handleInputChange}
      />
    </StyledInputDateTimeWrapper>
  )
}

const StyledInputDateTimeWrapper = styled.div`
  /* width: 100%; */
`;

const StyledInputDateTime = styled.input`
  border-color: hsl(0, 0%, 80%);
  border-radius: 4px;
  border-style: solid;
  border-width: 1px;
  font-size: 12px;
  letter-spacing: 1px;
  padding-top: 0;
  padding-bottom: 0;
  padding-left: 14px;
  height: 38px;
`;
