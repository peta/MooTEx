# MooTEx -- Miscellaneous extensions for MooTools

A few days ago, I decided to switch to MooTools. Beside impressive builtin-functionalities and its distinct idioms, the main reason for my decision was, that I can extend and modify almost every component of this language framework to make it exactly suit my demands. Extensions I write in this course will be published in this repository. 

**NOTE:** All extensions are written by me -- Peter Geil -- and none of them belongs to the MooTools Core/More codebase. Although they're called "extensions for MooTools" their usage partially alters the core implementation of MooTools and may therefore lead to unexpected problems (especially with future versions of MooTools and/or 3rd party components).

I alwyas try to write my extensions considered and with foresight, but for the case you encounter a problem, please feel free to contact me or -- even better -- drop an issue.

 
## List of extensions 

+   mootex.core.hash.DeepCombine.js
+   mootex.core.hash.GenerateFromPath.js
+   mootex.mod.NamespaceManager.js


### mootex.core.hash.DeepCombine.js
By default _Hash.combine(**a**, **b**)_ does shallow combinations and unlinks (duplicates) the **operand b**. There are often situations where a deep combination is desired and/or objects (!=literals) within **operand b** should be included by reference instead of duplication. The _DeepCombine extension_ allows exactly allows for those operations.
  
  
### mootex.core.hash.GenerateFromPath.js
_Hash.Extras.GetFromPath_ and _GenerateFromPath_ are twins; unfortunately separated directly after their birth. Instead of getting a value FROM AN EXISTING OBJECT, _GenerateFromPath_ takes the dotted-namespace string and returns his corresponding object-structure.


### mootex.mod.NamespaceManager.js
_NamespaceManager_ comes up with 