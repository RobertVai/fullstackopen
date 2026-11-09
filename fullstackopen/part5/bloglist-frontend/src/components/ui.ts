import styled from 'styled-components'
import { Link } from 'react-router-dom'

export const GlobalPage = styled.div`
  min-height: 100vh;
  background: #101727;
  color: #eaf0fb;
  font-family: Inter, system-ui, sans-serif;
  line-height: 1.5;
  padding: 28px 18px 64px;
`

export const Container = styled.div`
  width: min(860px, 100%);
  margin: 0 auto;
`

export const Heading = styled.h1`
  font-size: 2rem;
  letter-spacing: -0.045em;
  margin: 22px 0;
`

export const Navigation = styled.nav`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  padding: 14px 18px;
  border: 1px solid #29354d;
  border-radius: 14px;
  background: #172237;
`

export const NavItem = styled(Link)`
  color: #bcd3fa;
  text-decoration: none;
  font-weight: 600;
  &:hover { color: #ffffff; }
`

export const RightContent = styled.span`
  margin-left: auto;
  color: #a3b4d0;
  font-size: 0.9rem;
`

export const Panel = styled.section`
  margin: 18px 0;
  padding: 22px;
  border: 1px solid #29354d;
  border-radius: 14px;
  background: #172237;
`

export const Form = styled.form`
  display: grid;
  gap: 14px;
  max-width: 440px;
`

export const Field = styled.label`
  display: grid;
  gap: 6px;
  font-size: 0.92rem;
  font-weight: 600;
  color: #c3d3eb;
`

export const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  color: #ffffff;
  background: #0e182a;
  border: 1px solid #34425a;
  padding: 11px 12px;
  border-radius: 8px;
  font: inherit;
  &:focus-visible { outline: 2px solid #7faaff; outline-offset: 1px; }
`

export const Button = styled.button`
  cursor: pointer;
  background: #356fea;
  border: 1px solid #356fea;
  color: #ffffff;
  padding: 9px 14px;
  border-radius: 8px;
  font-weight: 600;
  font: inherit;
  width: fit-content;
  &:hover { background: #245bcc; }
  &:focus-visible { outline: 2px solid #b1c9ff; outline-offset: 2px; }
  &:disabled { opacity: 0.6; cursor: default; }
`

export const SecondaryButton = styled(Button)`
  background: #273751;
  border-color: #40516e;
  &:hover { background: #344663; }
`

export const DangerButton = styled(Button)`
  background: #9c3345;
  border-color: #9c3345;
  &:hover { background: #b64255; }
`

export const Actions = styled.div`
  display: flex;
  gap: 9px;
  flex-wrap: wrap;
  align-items: center;
  margin-top: 14px;
`

export const BlogCard = styled.article`
  margin: 12px 0;
  padding: 16px;
  background: #1c2a42;
  border: 1px solid #34435d;
  border-radius: 10px;
`

export const DetailText = styled.p`
  color: #b9c8df;
  overflow-wrap: anywhere;
`

export const Notice = styled.div<{ $error: boolean }>`
  padding: 14px 18px;
  margin: 16px 0;
  border-radius: 10px;
  border: 1px solid ${({ $error }) => $error ? '#f28b96' : '#64d4a0'};
  background: ${({ $error }) => $error ? '#4b2530' : '#193d35'};
  color: #ffffff;
`
