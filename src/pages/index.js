import React, { useState, createRef } from "react"
import { graphql, useStaticQuery, Link, navigate } from "gatsby"
import "./index.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons"

import Layout from "../components/layout"
import Fluid200 from "../components/Fluid200"
import SEO from "../components/seo"

const IndexPage = () => {
  const [lastTouchedItem, setLastTouchedItem] = useState(null)
  const [queryString, setQueryString] = useState()
  const filterSearchInputRef = createRef()

  const filterWithQueries = org => {
    if (queryString && queryString.length > 0) {
      return org.name.indexOf(queryString) > -1
    } else {
      return true
    }
  }

  const { orgs } = useStaticQuery(graphql`
    {
      orgs: allShinkanWebOrg {
        edges {
          node {
            posterImageUrls
            name
            primaryKey
            activityType
            activityIntroduce
          }
        }
      }
    }
  `)
  return (
    <Layout>
      <SEO title="ホーム" />

      <div className="page--index">
        <nav className="org-list-filter">
          <div className="org-list-filter__section org-list-filter__section--search">
            <span className="org-list-filter__section--search__icon-container">
              <FontAwesomeIcon
                icon={
                  queryString && queryString.length > 0 ? faTimes : faSearch
                }
                onClick={() => {
                  setQueryString()
                  filterSearchInputRef.current.focus()
                }}
              />
            </span>
            <input
              ref={filterSearchInputRef}
              onChange={e => setQueryString(e.target.value)}
              value={queryString || ""}
            />
          </div>
        </nav>
        <ul className="org-list">
          {orgs.edges
            .filter(({ node: org }) => filterWithQueries(org))
            .map(({ node: org }) => (
              <li className="org-list__item" key={org.primaryKey}>
                <Link to={`/org/${org.primaryKey}`}>
                  <figure className="org-list__item__poster">
                    <Fluid200 url={org.posterImageUrls[0]} alt="" />
                    <figcaption>
                      <h2 className="org-list__item__name">{org.name}</h2>
                      <p className="org-list__item__activity-introduce">
                        {org.activityIntroduce.slice(0, 100) + "..."}
                      </p>
                    </figcaption>
                  </figure>
                </Link>

                <div // スマホ用
                  className="org-list__item__sp-caption"
                  onClick={() => {
                    if (lastTouchedItem === org.primaryKey)
                      navigate(`/org/${org.primaryKey}`)
                    setLastTouchedItem(org.primaryKey)
                  }}
                >
                  <div className="org-list__item__sp-caption__name">
                    {org.name}
                  </div>
                  <div className="org-list__item__sp-caption__activity-introduce">
                    {org.activityIntroduce.slice(0, 100) + "..."}
                  </div>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </Layout>
  )
}

export default IndexPage
