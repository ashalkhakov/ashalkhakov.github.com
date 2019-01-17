<?xml version="1.0" standalone="yes"?>
<axsl:stylesheet xmlns:axsl="http://www.w3.org/1999/XSL/Transform" xmlns:sch="http://www.ascc.net/xml/schematron" version="1.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <axsl:template match="*|@*" mode="schematron-get-full-path">
    <axsl:apply-templates select="parent::*" mode="schematron-get-full-path"/>
    <axsl:text>/</axsl:text>
    <axsl:if test="count(. | ../@*) = count(../@*)">@</axsl:if>
    <axsl:value-of select="name()"/>
    <axsl:text>[</axsl:text>
    <axsl:value-of select="1+count(preceding-sibling::*[name()=name(current())])"/>
    <axsl:text>]</axsl:text>
  </axsl:template>
  <axsl:template match="/">
    <axsl:apply-templates select="/" mode="M0"/>
    <axsl:apply-templates select="/" mode="M1"/>
  </axsl:template>
  <axsl:template match="atom:feed" priority="4000" mode="M0">
    <axsl:choose>
      <axsl:when test="atom:author or not(atom:entry[not(atom:author)])"/>
      <axsl:otherwise>An atom:feed must have an atom:author unless all of its atom:entry children have an atom:author.</axsl:otherwise>
    </axsl:choose>
    <axsl:apply-templates mode="M0"/>
  </axsl:template>
  <axsl:template match="text()" priority="-1" mode="M0"/>
  <axsl:template match="atom:entry" priority="4000" mode="M1">
    <axsl:choose>
      <axsl:when test="atom:link[@rel='alternate'] or atom:link[not(@rel)] or atom:content"/>
      <axsl:otherwise>An atom:entry must have at least one atom:link element with a rel attribute of 'alternate' or an atom:content.</axsl:otherwise>
    </axsl:choose>
    <axsl:apply-templates mode="M1"/>
  </axsl:template>
  <axsl:template match="atom:entry" priority="3999" mode="M1">
    <axsl:choose>
      <axsl:when test="atom:author or ../atom:author or atom:source/atom:author"/>
      <axsl:otherwise>An atom:entry must have an atom:author if its feed does not.</axsl:otherwise>
    </axsl:choose>
    <axsl:apply-templates mode="M1"/>
  </axsl:template>
  <axsl:template match="text()" priority="-1" mode="M1"/>
  <axsl:template match="text()" priority="-1"/>
</axsl:stylesheet>
